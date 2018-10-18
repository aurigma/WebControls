// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Web.UI;

namespace Aurigma.GraphicsMill.AjaxControls
{
    [System.Drawing.ToolboxBitmap(typeof(PanNavigator), "Resources.PanNavigator.bmp")]
    [NonVisualControl]
    public class PanNavigator : UserInputController, INavigator
    {
        public PanNavigator()
        {
            ScriptClassName = "Aurigma.GraphicsMill.PanNavigator";
        }
    }
}