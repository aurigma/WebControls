// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Web.Hosting;

namespace Aurigma.GraphicsMill.AjaxControls
{
    /// <summary>
    /// Virtual path provider for automatic loading public file cache items
    /// </summary>
    internal class FileCachePathProvider : VirtualPathProvider
    {
        public FileCachePathProvider()
            : base()
        {
        }

        private static bool IsFileCacheHandler(string virtualPath)
        {
            return virtualPath == Configuration.Instance.FileCacheHandlerPath;
        }

        public override bool FileExists(string virtualPath)
        {
            return IsFileCacheHandler(virtualPath) || Previous.FileExists(virtualPath);
        }

        public override bool DirectoryExists(string virtualDir)
        {
            return Previous.DirectoryExists(virtualDir);
        }

        public override VirtualFile GetFile(string virtualPath)
        {
            if (IsFileCacheHandler(virtualPath))
            {
                return new FileCacheVirtualFile(virtualPath);
            }
            else
            {
                return Previous.GetFile(virtualPath);
            }
        }

        public override VirtualDirectory GetDirectory(string virtualDir)
        {
            return Previous.GetDirectory(virtualDir);
        }
    }
}