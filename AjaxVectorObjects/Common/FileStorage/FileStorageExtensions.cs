// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.IO;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileStorage
{
    public static class FileStorageExtensions
    {
        public static string AddFile(this IFileStorage storage, string filePath, bool fixColorProfile)
        {
            if (!fixColorProfile || filePath == null)
                return storage.AddFile(filePath);

            var fixedFilePath = ColorManagement.FixColorProfile(filePath);

            return fixedFilePath == null ? storage.AddFile(filePath) : AddFixedFile(storage, fixedFilePath);
        }

        public static string AddFile(this IFileStorage storage, string extension, Stream fileData, bool fixColorProfile)
        {
            if (!fixColorProfile || fileData == null)
                return storage.AddFile(extension, fileData);

            var fixedFilePath = ColorManagement.FixColorProfile(fileData);

            return fixedFilePath == null ? storage.AddFile(extension, fileData) : AddFixedFile(storage, fixedFilePath);
        }

        private static string AddFixedFile(IFileStorage storage, string filePath)
        {
            var fileId = storage.AddFile(filePath);

            try
            {
                File.Delete(filePath);
            }
            catch (Exception e)
            {
                Configuration.Logger.Warning(string.Format(@"Unable to delete temp file {0}", filePath), e);
            }

            return fileId;
        }
    }
}