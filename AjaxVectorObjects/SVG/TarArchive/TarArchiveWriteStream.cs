// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using tar_cs;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class TarArchiveWriteStream : TarArchiveStream
    {
        private readonly string _fileName;
        private readonly TarWriter _tarWriter;

        private bool _isHeaderWrote = false;

        private int _fileSize = 0;
        private UsTarHeader _tarHeader;

        public TarArchiveWriteStream(string fileName, TarWriter tarWriter)
        {
            _fileName = fileName;
            _tarWriter = tarWriter;

            _tarHeader = _tarWriter.CreateDefaultTarHeader();
            _tarHeader.FileName = fileName;
        }

        public override int Read(byte[] buffer, int offset, int count)
        {
            throw new NotImplementedException();
        }

        public override void Write(byte[] buffer, int offset, int count)
        {
            if (IsClosed)
                throw new TarArchive.TarFileStorageException("Stream is closed");

            if (!_isHeaderWrote)
            {
                _tarHeader.SizeInBytes = count;

                _tarWriter.WriteHeader(_tarHeader);

                _isHeaderWrote = true;
            }

            _tarWriter.WriteContent(buffer, offset, count);
            _fileSize += count;
        }

        public override bool CanRead
        {
            get { return false; }
        }

        public override bool CanWrite
        {
            get { return true; }
        }

        public override long Length
        {
            get { throw new NotImplementedException(); }
        }

        public override long Position { get; set; }

        public override void Close()
        {
            _tarHeader.SizeInBytes = _fileSize;
            _tarWriter.RewriteHeader(_tarHeader);
            _tarWriter.AlignTo512(_fileSize, false);

            base.Close();
        }
    }
}