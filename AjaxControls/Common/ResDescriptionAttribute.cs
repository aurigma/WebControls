// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls
{
    [AttributeUsage(AttributeTargets.All)]
    internal sealed class ResDescriptionAttribute : System.ComponentModel.DescriptionAttribute
    {
        private bool _replaced;

        public ResDescriptionAttribute(string description)
            : base(description)
        {
        }

        public override string Description
        {
            get
            {
                if (!this._replaced)
                {
                    this._replaced = true;

                    System.Resources.ResourceManager resourceManager =
                        new System.Resources.ResourceManager("Aurigma.GraphicsMill.AjaxControls.Resources.Messages", typeof(Common).Assembly);

                    base.DescriptionValue = resourceManager.GetString(base.Description);
                }
                return base.Description;
            }
        }
    }
}