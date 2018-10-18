// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.IO;
using System.Web.Hosting;

namespace Aurigma.GraphicsMill.AjaxControls
{
    internal class FileCacheVirtualFile : VirtualFile
    {
        public FileCacheVirtualFile(string virtualPath)
            : base(virtualPath)
        {
        }

        public override Stream Open()
        {
            Stream stream = new MemoryStream();

            System.IO.Stream resourceStream = this.GetType().Assembly.GetManifestResourceStream("Aurigma.GraphicsMill.AjaxControls.Resources.FileCacheHandlerPage.aspx");

            byte[] buffer = new byte[resourceStream.Length];

            resourceStream.Read(buffer, 0, Convert.ToInt32(resourceStream.Length));

            stream.Write(buffer, 0, buffer.Length);

            stream.Seek(0, SeekOrigin.Begin);

            return stream;
        }
    }
}