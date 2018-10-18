// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Logger;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Timers;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileStorage
{
    public class FileStorage : IProtectableFileStorage, ICleanableFileStorage
    {
        private readonly FileStorageConfiguration _config;
        private readonly ILogger _logger;
        private readonly NamedLock _namedLocker = new NamedLock();

        private bool _isCleanupRunning;
        private readonly Timer _cleaner = new Timer();

        public FileStorage() : this(null, null)
        {
        }

        public FileStorage(FileStorageConfiguration config = null, ILogger logger = null)
        {
            _config = config ?? new FileStorageConfiguration();
            _logger = logger ?? Configuration.Logger;

            if (!Directory.Exists(_config.RootPath))
                Directory.CreateDirectory(_config.RootPath);

            // No limit
            if (_config.MaxSize == -1) 
                return;

            Common.StartTask(Cleanup);

            _cleaner = new Timer { Interval = _config.CleanUpInterval * 1000 };
            _cleaner.Elapsed += (s, e) => { Cleanup(); };
            _cleaner.Start();
        }

        ~FileStorage()
        {
            Dispose();
        }

        public void Dispose()
        {
            if (_cleaner == null)
                return;

            _cleaner.Stop();
            _cleaner.Dispose();
        }

        public Func<string, DateTime?> GetLastAccessTimeMethod { get; set; }

        internal event EventHandler CleanupStarted;

        private void OnCleanupStarted()
        {
            var handler = CleanupStarted;
            if (handler != null)
                handler(this, EventArgs.Empty);
        }

        internal event EventHandler CleanupFinished;

        private void OnCleanupFinished()
        {
            var handler = CleanupFinished;
            if (handler != null)
                handler(this, EventArgs.Empty);
        }

        private string[] GetFilenames()
        {
            return new DirectoryInfo(_config.RootPath).EnumerateDirectories().SelectMany(d => d.EnumerateFiles("*", SearchOption.AllDirectories)).
                Select(f => Path.Combine(f.Directory.Name, f.Name)).ToArray();
        }

        private IEnumerable<string> EnumerateFilePaths(string[] filenames = null)
        {
            filenames = filenames ?? GetFilenames();

            return filenames.Select(filename => Path.Combine(_config.RootPath, filename));
        }

        internal long GetStorageSize()
        {
            return GetStorageSize(EnumerateFilePaths());
        }

        private long GetStorageSize(IEnumerable<string> filePaths)
        {
            return filePaths.Sum(filePath =>
            {
                var fileLock = _namedLocker.GetLock(filePath);
                lock (fileLock)
                {
                    var file = new FileInfo(filePath);
                    return file.Exists ? file.Length : 0;
                }
            });
        }

        private void Cleanup()
        {
            if (_isCleanupRunning)
                return;

            var filenames = GetFilenames();
            var storageSize = GetStorageSize(EnumerateFilePaths(filenames));
            if (storageSize < _config.MaxSize * _config.MaxUtilizationThreshold * 0.01)
                return;

            OnCleanupStarted();
            _isCleanupRunning = true;

            var getLastAccessTime = new Func<string, DateTime>(filePath =>
            {
                if (GetLastAccessTimeMethod != null)
                {
                    var result = GetLastAccessTimeMethod(GetFileIdFromPath(filePath));
                    if (result.HasValue)
                        return result.Value;
                }

                return File.GetLastAccessTime(filePath);
            });

            var isProtected = new Func<string, bool>(filePath =>
            {
                var fileId = GetFileIdFromPath(filePath);
                return IsProtected(fileId);
            });

            var query = EnumerateFilePaths(filenames).Where(f => !isProtected(f)).OrderBy(f => getLastAccessTime(f));

            var needToRemove = (long)(storageSize - _config.MaxSize * _config.UtilizationTarget * 0.01);
            var removed = 0L;
            foreach (var filePath in query)
            {
                if (removed >= needToRemove)
                    break;

                try
                {
                    var fileLock = _namedLocker.GetOrAddLock(filePath);
                    lock (fileLock)
                    {
                        if (File.Exists(filePath))
                        {
                            var fileSize = new FileInfo(filePath).Length;
                            File.Delete(filePath);
                            removed += fileSize;
                        }
                    }
                    _namedLocker.RemoveLock(filePath);
                }
                catch (Exception)
                {
                    _logger.Warning(string.Format("Unable to delete file {0}.", filePath));
                }

                var directory = new FileInfo(filePath).Directory;
                if (directory != null && directory.Exists && directory.GetFiles().Length == 0)
                {
                    try
                    {
                        directory.Delete();
                    }
                    catch (Exception)
                    {
                        _logger.Warning(string.Format("Unable to delete directory {0}.", directory.FullName));
                    }
                }
            }

            _isCleanupRunning = false;
            OnCleanupFinished();
        }

        #region IFileStorage Members

        public string AddFile(string filePath)
        {
            if (!File.Exists(filePath))
                throw new FileNotFoundException(string.Format("File {0} not found.", filePath), filePath);

            var fileInfo = new FileInfo(filePath);
            var fileId = AjaxControls.Common.CalculateMD5(fileInfo) + fileInfo.Extension;

            AddFileWithId(fileId, filePath);

            return fileId;
        }

        public void AddFileWithId(string fileId, string filePath)
        {
            if (!IsValidId(fileId))
                throw new ArgumentException(string.Format("File id {0} is not valid.", fileId), "fileId");

            if (!File.Exists(filePath))
                throw new FileNotFoundException(string.Format("File {0} not found.", filePath), filePath);

            WriteToStream(fileId, stream =>
            {
                using (var source = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    Common.CopyStream(source, stream);
                }
            });
        }

        public string AddFile(string extension, Stream fileData)
        {
            if (extension == null)
                throw new ArgumentNullException("extension");

            if (fileData == null)
                throw new ArgumentNullException("fileData");

            var fileId = AjaxControls.Common.CalculateMD5(fileData) + "." + extension;
            AddFileWithId(fileId, fileData);

            return fileId;
        }

        public void AddFileWithId(string fileId, Stream fileData)
        {
            if (!IsValidId(fileId))
                throw new ArgumentException(string.Format("File id {0} is not valid.", fileId), "fileId");

            if (fileData == null)
                throw new ArgumentNullException("fileData");

            WriteToStream(fileId, stream => { Common.CopyStream(fileData, stream); });
        }

        public void WriteToStream(string fileId, Action<Stream> action)
        {
            if (!IsValidId(fileId))
                throw new ArgumentException(string.Format("File id {0} is not valid.", fileId), "fileId");

            if (action == null)
                throw new ArgumentNullException("action");

            var cacheFilePath = GetCacheFilePath(fileId);

            if (File.Exists(cacheFilePath))
                return;

            var fileLock = _namedLocker.GetOrAddLock(cacheFilePath);
            lock (fileLock)
            {
                if (!File.Exists(cacheFilePath))
                {
                    try
                    {
                        using (var fileStream = new FileStream(cacheFilePath, FileMode.OpenOrCreate, FileAccess.Write))
                        {
                            action(fileStream);
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new FileStorageException(string.Format("Unable to create write stream for {0} file id.", fileId), ex);
                    }
                }
            }
            _namedLocker.RemoveLock(cacheFilePath);
        }

        public Stream GetReadStream(string fileId)
        {
            if (!IsValidId(fileId))
                throw new ArgumentException(string.Format("File id {0} is not valid.", fileId), "fileId");

            var cacheFilePath = GetCacheFilePath(fileId);

            if (!File.Exists(cacheFilePath))
                return null;

            try
            {
                var fileLock = _namedLocker.GetLock(cacheFilePath);
                lock (fileLock)
                {
                    if (File.Exists(cacheFilePath))
                        return new FileStream(cacheFilePath, FileMode.Open, FileAccess.Read, FileShare.Read);
                }
            }
            catch (Exception ex)
            {
                throw new FileStorageException(string.Format("Unable to create read stream for {0} file id.", fileId), ex);
            }

            return null;
        }

        public bool RemoveFile(string fileId)
        {
            if (!IsValidId(fileId))
                throw new ArgumentException(string.Format("File id {0} is not valid.", fileId), "fileId");

            if (IsProtected(fileId))
            {
                _logger.Warning(string.Format("Unable to delete file with id {0}. File is protected.", fileId));
                return false;
            }

            var cacheFilePath = GetCacheFilePath(fileId);

            if (!File.Exists(cacheFilePath))
                return true;

            var result = true;
            try
            {
                var fileLock = _namedLocker.GetOrAddLock(cacheFilePath);
                lock (fileLock)
                {
                    if (File.Exists(cacheFilePath))
                        File.Delete(cacheFilePath);
                }
                _namedLocker.RemoveLock(cacheFilePath);
            }
            catch (Exception ex)
            {
                _logger.Warning(string.Format("Unable to delete {0} file.", fileId), ex);
                result = false;
            }

            return result;
        }

        public bool FileExists(string fileId)
        {
            if (!IsValidId(fileId))
                return false;

            var cacheFilePath = GetCacheFilePath(fileId);

            var fileLock = _namedLocker.GetLock(cacheFilePath);
            lock (fileLock)
            {
                return File.Exists(cacheFilePath);
            }
        }

        #endregion IFileStorage Members

        #region IProtectableFileStorage implementation

        public virtual void SetProtection(string fileId, bool value)
        {
            throw new NotSupportedException();
        }

        public virtual bool IsProtected(string fileId)
        {
            return false;
        }

        #endregion IProtectableFileStorage implementation

        private static bool IsValidId(string fileId)
        {
            return fileId != null && !string.IsNullOrEmpty(fileId.Trim()) && !fileId.Intersect(Path.GetInvalidFileNameChars()).Any();
        }

        internal string GetCacheFilePath(string fileId)
        {
            if (fileId == null)
                return null;

            var folderName = Path.GetFileNameWithoutExtension(fileId).Length > 4 ? fileId.Substring(0, 4) : "0000";
            var fileName = Path.GetFileNameWithoutExtension(fileId).Length > 4 ? fileId.Substring(4) : fileId;

            var folderPath = Path.Combine(_config.RootPath, folderName);

            if (!Directory.Exists(_config.RootPath))
                Directory.CreateDirectory(_config.RootPath);

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            return Path.Combine(folderPath, fileName);
        }

        internal string GetFileIdFromPath(string filePath)
        {
            var fileInfo = new FileInfo(filePath);

            var fileName = fileInfo.Name;
            var folderName = fileInfo.Directory.Name;

            return folderName == "0000" ? fileName : folderName + fileName;
        }
    }
}