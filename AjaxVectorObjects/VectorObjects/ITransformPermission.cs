// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public interface ITransformPermission
    {
        bool AllowMoveHorizontal { get; set; }
        bool AllowMoveVertical { get; set; }
        bool AllowFreeMove { get; }

        bool AllowRotate { get; set; }

        bool AllowProportionalResize { get; set; }
        bool AllowArbitraryResize { get; set; }
    }
}