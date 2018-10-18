// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Web.UI;

namespace Aurigma.GraphicsMill.AjaxControls
{
    /// <summary>
    /// Converts a navigator control on the Web Forms page to a string.
    /// </summary>
    public class NavigatorConverter : BaseControlConverter
    {
        public NavigatorConverter()
        {
        }

        protected override bool IsTypeCorrect(Control control)
        {
            return control is INavigator;
        }
    }
}