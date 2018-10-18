// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.Svg;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class SvgVoPlainText : SvgVoText
    {
        public PointF BaselineLocation { get; set; }
        public bool IsVertical { get; set; }

        public override IEnumerable<SvgAttribute> GetAttributes()
        {
            var baseAttributes = base.GetAttributes();
            if (baseAttributes != null)
            {
                foreach (var attr in baseAttributes)
                {
                    yield return attr;
                }
            }

            var ci = CultureInfo.InvariantCulture;
            yield return new SvgAttribute("baselinelocation", null,
                XmlNamespace.AurigmaVectorObjects,
                () => BaselineLocation.X.ToString(ci) + " " + BaselineLocation.Y.ToString(ci),
                v => BaselineLocation = new PointF(SvgAttribute.ParseFloatArray(v)[0], SvgAttribute.ParseFloatArray(v)[1])
            );

            yield return new SvgAttribute("is-vertical", bool.FalseString,
                () => IsVertical.ToString(),
                v => IsVertical = SvgAttribute.ParseBooleanAttribute(v)
            );
        }
    }
}