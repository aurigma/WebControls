// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls
{
    public interface IFileCache
    {
        string GetAbsolutePrivateCachePath(string fileName);

        string GetAbsolutePublicCachePath(string fileName);

        string GetPrivateTempFileName(string extension);

        string GetPrivateTempFileName(string extension, bool isDirectory);

        string GetPublicTempFileName(string extension);

        string GetPublicTempFileName(string extension, bool isDirectory);

        string GetRelativePublicCachePath(string fileName);

        void RegisterPrivateTempFileName(string fileName, bool isDirectory);

        void RegisterPublicTempFileName(string fileName, bool isDirectory);
    }
}