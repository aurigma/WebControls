// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileStorage;
using Aurigma.GraphicsMill.Codecs;
using System;
using System.IO;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileCache
{
    public class FileCache : IFileCache, ISerializableStorage, IDisposable
    {
        private readonly IFileStorage _fileStorage;
        private readonly bool _updateCacheItemSynchronously;

        internal MemoryCache MemoryCache { get; private set; }

        internal FileCache(IFileStorage fileStorage, bool updateCacheItemSynchronously)
        {
            MemoryCache = new MemoryCache("VectorObjects_FileCache_MemoryCache");

            _fileStorage = fileStorage;
            _updateCacheItemSynchronously = updateCacheItemSynchronously;

            var cleanableFileStorage = _fileStorage as ICleanableFileStorage;
            if (cleanableFileStorage != null)
            {
                cleanableFileStorage.GetLastAccessTimeMethod = fileId =>
                {
                    var cacheItem = MemoryCache.Get(fileId) as Item;
                    return cacheItem != null ? new DateTime?(cacheItem.LastAccessTime) : null;
                };
            }
        }

        public FileCache(IFileStorage fileStorage) :
            this(fileStorage, false)
        {
        }

        public void Dispose()
        {
            if (_fileStorage != null)
                _fileStorage.Dispose();

            if (MemoryCache != null)
                MemoryCache.Dispose();
        }

        public string AddFile(string filePath, bool isSource = false)
        {
            var fileId = _fileStorage.AddFile(filePath, fixColorProfile: isSource);

            UpdateCacheItemAsync(fileId, isSource);

            return fileId;
        }

        public void AddFileWithId(string fileId, string filePath, bool isSource = false)
        {
            _fileStorage.AddFileWithId(fileId, filePath);

            UpdateCacheItemAsync(fileId, isSource);
        }

        public string AddFile(string extension, Stream fileData, bool isSource = false)
        {
            var fileId = _fileStorage.AddFile(extension, fileData, fixColorProfile: isSource);

            UpdateCacheItemAsync(fileId, isSource);

            return fileId;
        }

        public void AddFileWithId(string fileId, Stream fileData, bool isSource = false)
        {
            _fileStorage.AddFileWithId(fileId, fileData);

            UpdateCacheItemAsync(fileId, isSource);
        }

        public void WriteToStream(string fileId, Action<Stream> action, bool isSource = false)
        {
            _fileStorage.WriteToStream(fileId, action);

            UpdateCacheItemAsync(fileId, isSource);
        }

        public Stream GetReadStream(string fileId, bool isSource = false)
        {
            var stream = _fileStorage.GetReadStream(fileId);

            if (stream != null)
                UpdateCacheItemAsync(fileId, isSource);
            else
                MemoryCache.Remove(fileId);

            return stream;
        }

        public bool RemoveFile(string fileId)
        {
            var result = _fileStorage.RemoveFile(fileId);

            if (result)
                MemoryCache.Remove(fileId);

            return result;
        }

        public bool FileExists(string fileId)
        {
            return _fileStorage.FileExists(fileId);
        }

        public SourceImageParams GetSourceImageParams(string fileId)
        {
            if (!_fileStorage.FileExists(fileId))
                throw new FileStorageException(string.Format("Unable to get image parameters for {0} file id.", fileId));

            var cacheItem = UpdateCacheItem(fileId, true) as SourceImageItem;
            if (cacheItem == null)
                throw new FileStorageException(string.Format("Unable to get image parameters for {0} file id.", fileId));

            return cacheItem.SourceImageParams;
        }

        private void UpdateCacheItemAsync(string fileId, bool isSource)
        {
            if (!_updateCacheItemSynchronously)
                Common.StartTask(() => UpdateCacheItem(fileId, isSource));
            else
                UpdateCacheItem(fileId, isSource);
        }

        private Item UpdateCacheItem(string fileId, bool isSource)
        {
            var item = MemoryCache.Get(fileId);
            var cacheItem = isSource ? item as SourceImageItem : item as Item;

            if (cacheItem == null)
            {
                if (isSource)
                {
                    try
                    {
                        using (var stream = _fileStorage.GetReadStream(fileId))
                        using (var reader = ImageReader.Create(stream))
                        {
                            cacheItem = new SourceImageItem(reader);
                        }
                    }
                    catch (Exception)
                    {
                        cacheItem = new Item();
                    }
                }
                else
                    cacheItem = new Item();
            }
            else
                cacheItem.Update();

            MemoryCache.Set(fileId, cacheItem);

            return cacheItem;
        }

        internal class Item
        {
            public DateTime LastAccessTime;

            public Item()
            {
                Update();
            }

            public void Update()
            {
                LastAccessTime = DateTime.Now;
            }
        }

        internal class SourceImageItem : Item
        {
            public readonly SourceImageParams SourceImageParams;

            public SourceImageItem(ImageReader reader)
            {
                SourceImageParams = new SourceImageParams(reader);
            }
        }
    }
}