// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.IO;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public abstract class TarArchiveStream : Stream
    {
        protected TarArchiveStream()
        {
            IsClosed = false;
        }

        public bool IsClosed
        {
            get;
            private set;
        }

        public override void Flush()
        {
        }

        public override long Seek(long offset, SeekOrigin origin)
        {
            throw new NotImplementedException();
        }

        public override void SetLength(long value)
        {
            throw new NotImplementedException();
        }

        public override bool CanSeek
        {
            get { return false; }
        }

        public override void Close()
        {
            IsClosed = true;
        }
    }
}