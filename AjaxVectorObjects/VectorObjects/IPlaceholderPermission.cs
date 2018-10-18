// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public interface IPlaceholderPermission
    {
        bool AllowEditContent { get; set; }
        bool ShowEditButton { get; set; }
        bool ShowSelectButton { get; set; }
    }
}