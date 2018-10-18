// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls
{
    internal class FileCacheItem
    {
        private string _fileName;
        private DateTime _lastModifiedDate;
        private bool _isDirectory;

        public FileCacheItem(string fileName, DateTime lastModifiedDate, bool isDirectory)
        {
            _fileName = fileName;
            _lastModifiedDate = lastModifiedDate;
            _isDirectory = isDirectory;
        }

        public string FileName
        {
            get
            {
                return _fileName;
            }
        }

        public DateTime LastModifiedDate
        {
            get
            {
                return _lastModifiedDate;
            }
        }

        public bool IsDirectory
        {
            get
            {
                return _isDirectory;
            }
        }
    }
}