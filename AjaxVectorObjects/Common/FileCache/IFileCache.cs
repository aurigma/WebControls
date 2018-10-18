// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.IO;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileCache
{
    internal interface IFileCache
    {
        string AddFile(string filePath, bool isSource = false);

        void AddFileWithId(string fileId, string filePath, bool isSource = false);

        string AddFile(string extension, Stream fileData, bool isSource = false);

        void AddFileWithId(string fileId, Stream fileData, bool isSource = false);

        void WriteToStream(string fileId, Action<Stream> action, bool isSource = false);

        Stream GetReadStream(string fileId, bool isSource = false);

        bool RemoveFile(string fileId);

        bool FileExists(string fileId);

        SourceImageParams GetSourceImageParams(string fileId);
    }
}