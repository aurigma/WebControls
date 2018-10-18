// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;

namespace Aurigma.GraphicsMill.AjaxControls
{
    public class FileCache : IFileCache
    {
        private static readonly Regex _invalidFileRg = new Regex(@"/|\\|\.\.|\*", RegexOptions.Compiled);

        private static string _indexFileName = "index.dat";
        private static int _indexLockTimeout = 10000;
        private static int _sleepTime = 50;
        private static int _sleepTimeDelta = _sleepTime / 5;

        private IConfiguration _configuration;

        private FileCache()
        {
            _configuration = Configuration.Instance;
        }

        // Thread-safe lazy singletom implementation
        // http://msdn.microsoft.com/en-us/library/ms998558.aspx
        private static volatile IFileCache _instance;

        private static object _lock = new Object();

        /// <summary>
        /// File cache instance
        /// </summary>
        public static IFileCache GetInstance()
        {
            if (_instance == null)
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        var factory = FactoryMethod;
                        if (factory != null)
                        {
                            _instance = factory();
                        }
                        else
                        {
                            _instance = new FileCache();
                        }
                    }
                }
            }

            return _instance;
        }

        /// <summary>
        /// Factory method to inject custom IFileCache implementation into the singleton value.
        /// </summary>
        public static Func<IFileCache> FactoryMethod { get; set; }

        #region Public methods

        public string GetPublicTempFileName(string extension, bool isDirectory)
        {
            string fileName = Guid.NewGuid().ToString() + extension;
            RegisterPublicTempFileName(fileName, isDirectory);
            return fileName;
        }

        public string GetPublicTempFileName(string extension)
        {
            return GetPublicTempFileName(extension, false);
        }

        public void RegisterPublicTempFileName(string fileName, bool isDirectory)
        {
            var indexFile = LockIndexFile(Path.Combine(_configuration.AbsolutePublicCachePath, _indexFileName));
            try
            {
                var publicFiles = LoadIndex(indexFile);

                publicFiles.RemoveAll(item => item.FileName == fileName);

                CleanupFiles(publicFiles, _configuration.AbsolutePublicCachePath, _configuration.PublicCacheMaxFileCount, _configuration.PublicCacheMaxLifeTime);
                publicFiles.Insert(0, new FileCacheItem(fileName, DateTime.Now, isDirectory));

                SaveIndex(indexFile, publicFiles);
            }
            finally
            {
                indexFile.Close();
            }
        }

        public string GetPrivateTempFileName(string extension, bool isDirectory)
        {
            var fileName = Guid.NewGuid().ToString() + extension;
            RegisterPrivateTempFileName(fileName, isDirectory);
            return fileName;
        }

        public string GetPrivateTempFileName(string extension)
        {
            return GetPrivateTempFileName(extension, false);
        }

        public void RegisterPrivateTempFileName(string fileName, bool isDirectory)
        {
            var indexFile = LockIndexFile(Path.Combine(_configuration.AbsolutePrivateCachePath, _indexFileName));
            try
            {
                var privateFiles = LoadIndex(indexFile);

                privateFiles.RemoveAll(item => item.FileName == fileName);

                CleanupFiles(privateFiles, _configuration.AbsolutePrivateCachePath, _configuration.PrivateCacheMaxFileCount, _configuration.PrivateCacheMaxLifeTime);
                privateFiles.Insert(0, new FileCacheItem(fileName, DateTime.Now, isDirectory));

                SaveIndex(indexFile, privateFiles);
            }
            finally
            {
                indexFile.Close();
            }
        }

        public string GetAbsolutePrivateCachePath(string fileName)
        {
            ValidateFileName(fileName);

            return Path.Combine(_configuration.AbsolutePrivateCachePath, fileName);
        }

        public string GetRelativePublicCachePath(string fileName)
        {
            ValidateFileName(fileName);

            if (_configuration.UseAutoDeployedFileCache)
            {
                return _configuration.FileCacheHandlerPath + "?id=" + fileName;
            }
            else
            {
                if (_configuration.RelativePublicCachePath[_configuration.RelativePublicCachePath.Length - 1] == '/')
                    return _configuration.RelativePublicCachePath + fileName;
                else
                    return _configuration.RelativePublicCachePath + '/' + fileName;
            }
        }

        public string GetAbsolutePublicCachePath(string fileName)
        {
            ValidateFileName(fileName);

            return Path.Combine(_configuration.AbsolutePublicCachePath, fileName);
        }

        #endregion Public methods

        #region Private methods

        static private void CleanupFiles(IList<FileCacheItem> files, string path, int maxFileCount, int maxFileLifeTime)
        {
            Configuration.Logger.Trace(string.Format("CleanupFiles ({0}) starting", path));
            try
            {
                Action<FileCacheItem, int> deleteItemByIndex = (item, index) =>
                {
                    try
                    {
                        if (item.IsDirectory)
                            Directory.Delete(path + item.FileName);
                        else
                            File.Delete(path + item.FileName);
                    }
                    catch (IOException ex)
                    {
                        Configuration.Logger.Error(
                            string.Format("CleanupFiles ({0}) - Got IOException while cleaning cache item [{1}, {2}]", path,
                                item.IsDirectory ? "Directory" : "File", item.FileName), ex);
                    }
                    catch (Exception ex)
                    {
                        Configuration.Logger.Error(
                            string.Format("CleanupFiles ({0}) - Got {3} while cleaning cache item [{1}, {2}]", path,
                                item.IsDirectory ? "Directory" : "File", item.FileName, ex.GetType().Name), ex);
                        throw;
                    }

                    files.RemoveAt(index);
                };

                Configuration.Logger.Trace(string.Format("    CleanupFiles ({0}). Deleting old files", path));
                
                // Delete old files
                var pos = files.Count - 1;
                while (pos >= 0)
                {
                    var fileCacheItem = files[pos];
                    if (DateTime.Now.Subtract(fileCacheItem.LastModifiedDate).TotalSeconds > maxFileLifeTime)
                    {
                        deleteItemByIndex(fileCacheItem, pos);

                        pos--;
                    }
                    else
                    {
                        break;
                    }
                }
                Configuration.Logger.Trace(string.Format("    CleanupFiles ({0}). Deleting old files done", path));

                // Delete files over max file count
                if (files.Count > maxFileCount)
                {
                    Configuration.Logger.Trace(string.Format("    CleanupFiles ({0}). Deleting files over threshold ({1} > {2})",
                        path, files.Count, maxFileCount));

                    var thresholdFileCount = (int)(Math.Floor(maxFileCount * 0.9));
                    while (files.Count > thresholdFileCount)
                    {
                        var itemIndex = files.Count - 1;

                        var fileCacheItem = files[itemIndex];

                        deleteItemByIndex(fileCacheItem, itemIndex);

                        files.RemoveAt(itemIndex);
                    }

                    Configuration.Logger.Trace(string.Format("    CleanupFiles ({0}). Deleting files over threshold done",
                        path, files.Count, maxFileCount));
                }
            }
            catch (Exception ex)
            {
                Configuration.Logger.Error(string.Format("CleanupFiles ({0}) - Got exception during cleanup", path), ex);
                throw;
            }
            finally
            {
                Configuration.Logger.Trace(string.Format("CleanupFiles ({0}) done.", path));
            }
        }

        private static FileStream LockIndexFile(string path)
        {
            var time = 0;
            var random = new Random();

            while (time < _indexLockTimeout)
            {
                int actualSleepTime;
                try
                {
                    return File.Open(path, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None);
                }
                catch (IOException)
                {
                    actualSleepTime = _sleepTime + random.Next(-_sleepTimeDelta, _sleepTimeDelta);
                    System.Threading.Thread.Sleep(actualSleepTime);
                }
                catch (UnauthorizedAccessException)
                {
                    var cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                    throw new UnauthorizedAccessException(String.Format(cultureInfo,
                        Resources.Messages.CanNotWriteCacheDir, path));
                }

                time += actualSleepTime;
            }

            throw new FileCacheTimeoutException(Resources.Messages.IndexFileLockTimeoutHasExpired);
        }

        private List<FileCacheItem> LoadIndex(System.IO.FileStream stream)
        {
            System.Globalization.NumberFormatInfo format = Common.GetNumberFormat();

            List<FileCacheItem> index = new List<FileCacheItem>();

            System.IO.StreamReader reader = new System.IO.StreamReader(stream);

            string line;
            try
            {
                while ((line = reader.ReadLine()) != null)
                {
                    string[] l = line.Split();
                    FileCacheItem item = new FileCacheItem(l[0], new DateTime(Int64.Parse(l[1], format)), Boolean.Parse(l[2]));
                    index.Add(item);
                }
            }
            catch (Exception ex)
            {
                Configuration.Logger.Warning(ex.Message);

                var files = Directory.GetFiles(Path.GetDirectoryName(stream.Name));
                foreach (var file in files)
                {
                    if (Path.GetFileName(file) != _indexFileName)
                        File.Delete(file);
                }

                return new List<FileCacheItem>();
            }
            return index;
        }

        private static void SaveIndex(Stream stream, List<FileCacheItem> index)
        {
            stream.SetLength(0);

            var writer = new StreamWriter(stream);

            foreach (var item in index)
            {
                writer.Write(item.FileName);
                writer.Write(" ");
                writer.Write(item.LastModifiedDate.Ticks);
                writer.Write(" ");
                writer.WriteLine(item.IsDirectory);
            }

            writer.Flush();
        }

        private static void ValidateFileName(string fileName)
        {
            if (_invalidFileRg.IsMatch(fileName))
            {
                throw new System.Web.HttpRequestValidationException(Resources.Messages.DangerousInputDetected);
            }
        }

        #endregion Private methods
    }
}