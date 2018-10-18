// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.IO;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public interface ISerializableStorage
    {
        void AddFileWithId(string fileId, string filePath, bool isSource = false);

        void AddFileWithId(string fileId, Stream fileData, bool isSource = false);

        Stream GetReadStream(string fileId, bool isSource = false);

        bool FileExists(string fileId);
    }
}