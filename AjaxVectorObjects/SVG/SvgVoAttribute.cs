// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.Svg;
using System.Globalization;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    internal class SvgVoAttribute : SvgStaticAttribute
    {
        public SvgVoAttribute(string name, string value)
            : base(name, value, XmlNamespace.AurigmaVectorObjects, null)
        {
        }

        public SvgVoAttribute(string name, int value)
            : this(name, value.ToString(CultureInfo.InvariantCulture))
        {
        }

        public SvgVoAttribute(string name, bool value)
            : this(name, value.ToString(CultureInfo.InvariantCulture).ToLowerInvariant())
        {
        }

        public SvgVoAttribute(string name, System.Drawing.Color value)
            : this(name, value.A == 0 ? "none" : ColorTranslator.ToSvg(value))
        {
        }

        public SvgVoAttribute(string name, float value)
            : this(name, value.ToString(CultureInfo.InvariantCulture))
        {
        }
    }
}