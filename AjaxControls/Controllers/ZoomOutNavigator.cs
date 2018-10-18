// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Web.UI;

namespace Aurigma.GraphicsMill.AjaxControls
{
    [System.Drawing.ToolboxBitmap(typeof(ZoomOutNavigator), "Resources.ZoomOutNavigator.bmp")]
    [NonVisualControl]
    public class ZoomOutNavigator : UserInputController, INavigator
    {
        public ZoomOutNavigator() : base()
        {
            ScriptClassName = "Aurigma.GraphicsMill.ZoomOutNavigator";
        }
    }
}