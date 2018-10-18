// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

namespace Aurigma.GraphicsMill.AjaxControls
{
    [ResDescription("ZoomMode")]
    public enum ZoomMode
    {
        [ResDescription("ZoomMode_None")]
        None = 0,

        [ResDescription("ZoomMode_BestFit")]
        BestFit = 1,

        [ResDescription("ZoomMode_BestFitShrinkOnly")]
        BestFitShrinkOnly = 2,

        [ResDescription("ZoomMode_FitToWidth")]
        FitToWidth = 3,

        [ResDescription("ZoomMode_FitToHeight")]
        FitToHeight = 4,

        [ResDescription("ZoomMode_ZoomControl")]
        ZoomControl = 5,

        [ResDescription("ZoomMode_FitToWidthShrinkOnly")]
        FitToWidthShrinkOnly = 6,

        [ResDescription("ZoomMode_FitToHeightShrinkOnly")]
        FitToHeightShrinkOnly = 7
    }
}