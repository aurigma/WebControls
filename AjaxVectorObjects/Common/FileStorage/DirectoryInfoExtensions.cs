// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;
using System.IO;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileStorage
{
    public static class DirectoryInfoExtensions
    {
        public static IEnumerable<DirectoryInfo> EnumerateDirectories(this DirectoryInfo directory)
        {
            return directory.GetDirectories();
        }

        public static IEnumerable<FileInfo> EnumerateFiles(this DirectoryInfo directory, string searchPattern, SearchOption searchOption)
        {
            return directory.GetFiles(searchPattern, searchOption);
        }
    }
}