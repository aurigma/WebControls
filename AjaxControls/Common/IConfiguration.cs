// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls
{
    public interface IConfiguration
    {
        string AbsolutePrivateCachePath { get; }
        string AbsolutePublicCachePath { get; }
        string ClientScriptsLocation { get; }
        string FileCacheHandlerPath { get; }
        int PrivateCacheMaxFileCount { get; }
        int PrivateCacheMaxLifeTime { get; }
        int PublicCacheMaxFileCount { get; }
        int PublicCacheMaxLifeTime { get; }
        string RelativePublicCachePath { get; }
        bool UseAutoDeployedFileCache { get; }
    }
}