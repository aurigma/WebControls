// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using tar_cs;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class TarArchiveReadStream : TarArchiveStream
    {
        private readonly TarReader _tarReader;
        private readonly Action _onClose;
        private long _position = 0;

        public TarArchiveReadStream(TarReader tarReader, Action onClose)
        {
            _tarReader = tarReader;
            _onClose = onClose;
        }

        public override void Close()
        {
            _onClose();
            base.Close();
        }

        public override int Read(byte[] buffer, int offset, int count)
        {
            if (IsClosed)
                throw new TarArchive.TarFileStorageException("Stream is closed");

            var readBytes = _tarReader.Read(buffer, offset, count);

            _position += readBytes;

            return readBytes;
        }

        public override void Write(byte[] buffer, int offset, int count)
        {
            throw new NotImplementedException();
        }

        public override bool CanRead
        {
            get { return true; }
        }

        public override bool CanWrite
        {
            get { return false; }
        }

        public override long Length
        {
            get { return _tarReader.FileInfo.SizeInBytes; }
        }

        public override long Position
        {
            get { return _position; }
            set
            {
                if (value != _position)
                    throw new NotImplementedException();
            }
        }
    }
}