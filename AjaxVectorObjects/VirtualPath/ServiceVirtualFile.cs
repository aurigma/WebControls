// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.IO;
using System.Web.Hosting;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.VirtualPath
{
    internal class ServiceVirtualFile : VirtualFile
    {
        public ServiceVirtualFile(string virtualPath)
            : base(virtualPath)
        {
        }

        public override System.IO.Stream Open()
        {
            var stream = new MemoryStream(Properties.Resources.Service, false);
            return stream;
        }
    }
}