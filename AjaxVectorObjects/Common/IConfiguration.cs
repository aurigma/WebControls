// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public interface IConfiguration
    {
        /// <summary>
        /// Get path to GrayScale color profile. If null, embedded profile will be used.
        /// </summary>
        string GrayscaleColorProfileFileName { get; }

        /// <summary>
        /// Get path to RGB color profile. If null, embedded profile will be used.
        /// </summary>
        string RgbColorProfileFileName { get; }

        /// <summary>
        /// Get path to CMYC color profile. If null, embedded profile will be used.
        /// </summary>
        string CmykColorProfileFileName { get; }

        /// <summary>
        /// Get whether to allow to download remote images to storage. True by default.
        /// </summary>
        bool AllowDownloadImageToCache { get; }

        string TempDirectory { get; }

        string ColorProfilesDirectory { get; }

        string ServiceUrl { get; }

        string HandlerUrl { get; }

        string FontDirectory { get; }

        AdvancedDrawing.CustomFontRegistry FontRegistry { get; }
    }
}