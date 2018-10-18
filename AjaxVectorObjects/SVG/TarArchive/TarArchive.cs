// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization;
using tar_cs;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class TarArchive : BaseArchive
    {
        private readonly TarWriter _tarWriter;

        private long _initialPosition;
        private int _currentFileIndex = 0;
        private readonly Dictionary<string, int> _tarContent = new Dictionary<string, int>();
        private readonly Stream _tarStream;

        private TarArchiveReadStream _tarReadStream = null;
        private TarArchiveWriteStream _tarWriteStream = null;

        private Mode _storageMode;

        public enum Mode
        {
            Create,
            Read
        }

        public TarArchive(Stream tarStream, Mode mode)
        {
            _tarStream = tarStream;
            _storageMode = mode;

            switch (mode)
            {
                case Mode.Create:
                    _tarWriter = new TarWriter(_tarStream);
                    break;

                case Mode.Read:
                    InitTarReading();
                    break;

                default:
                    throw new TarFileStorageException("Unexpected mode");
            }
        }

        private void InitTarReading()
        {
            _initialPosition = _tarStream.Position;

            var initialTarReader = new TarReader(_tarStream);

            for (var number = 0; initialTarReader.MoveNext(skipData: true); number++)
            {
                var fileInfo = initialTarReader.FileInfo;

                if (fileInfo.EntryType != EntryType.File)
                {
                    Configuration.Logger.Warning(string.Format("Unexpected entry type {0} in tar", fileInfo.EntryType));
                    continue;
                }

                _tarContent[fileInfo.FileName] = number;
            }

            RewindStream();
        }

        private void RewindStream()
        {
            _tarStream.Position = _initialPosition;
        }

        private void RememberFile(string fileId)
        {
            _tarContent[fileId] = _currentFileIndex;

            _currentFileIndex++;
        }

        public override void AddFileWithId(string fileId, Stream fileData, bool isSource = false)
        {
            if (_storageMode != Mode.Create)
                throw new TarFileStorageException("Mode!");

            if (FileExists(fileId))
                return;

            _tarWriter.Write(fileData, fileData.Length - fileData.Position, fileId);

            RememberFile(fileId);
        }

        public override Stream GetReadStream(string fileId, bool isSource = false)
        {
            if (_storageMode != Mode.Read)
                throw new TarFileStorageException("Mode!");

            if (_tarReadStream != null && !_tarReadStream.IsClosed)
                throw new TarFileStorageException("Previews read stream have to be closed before creation new one");

            var initialStreamPosition = _tarStream.Position;
            var tarReader = new TarReader(_tarStream);

            if (!FileExists(fileId))
                throw new TarFileStorageException(string.Format("File {0} not found in tar file", fileId));

            var i = 0;
            do
            {
                tarReader.MoveNext(skipData: true);
                i++;
            } while ((i - 1) != _tarContent[fileId]);

            return (_tarReadStream = new TarArchiveReadStream(tarReader, () => _tarStream.Position = initialStreamPosition));
        }

        private Stream GetWriteStream(string fileId)
        {
            if (_tarWriteStream != null && !_tarWriteStream.IsClosed)
                throw new TarFileStorageException("Previews write stream have to be closed before creation new one");

            _tarWriteStream = new TarArchiveWriteStream(fileId, _tarWriter);

            RememberFile(fileId);

            return _tarWriteStream;
        }

        public override bool FileExists(string fileId)
        {
            return _tarContent.ContainsKey(fileId);
        }

        public override void WriteToStream(string fileId, Action<Stream> action)
        {
            using (var stream = GetWriteStream(fileId))
            {
                action(stream);
            }
        }

        public override void Dispose()
        {
            if (_tarWriter != null)
                _tarWriter.Dispose();
        }

        public class TarFileStorageException : Exception
        {
            public TarFileStorageException()
            {
            }

            public TarFileStorageException(string message) : base(message)
            {
            }

            public TarFileStorageException(string message, Exception innerException) : base(message, innerException)
            {
            }

            protected TarFileStorageException(SerializationInfo info, StreamingContext context) : base(info, context)
            {
            }
        }
    }
}