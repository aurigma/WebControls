// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;

namespace Aurigma.Svg
{
    public class SvgLine : SvgGraphicElement
    {
        private readonly string _name = "line";

        public SvgLine()
        {
            Stroke = Color.Black;
        }

        public float X1 { get; set; }

        public float Y1 { get; set; }

        public float X2 { get; set; }

        public float Y2 { get; set; }

        public float StrokeWidth { get; set; }

        public Color Stroke { get; set; }

        public List<float> StrokeDashArray { get; set; }

        public float StrokeDashOffset { get; set; }

        public override string LocalName
        {
            get { return _name; }
        }

        public override string Name
        {
            get { return _name; }
        }

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

            yield return new SvgAttribute("x1", "0",
                () => X1.ToString(ci),
                v => X1 = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("y1", "0",
                () => Y1.ToString(ci),
                v => Y1 = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("x2", "0",
                () => X2.ToString(ci),
                v => X2 = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("y2", "0",
                () => Y2.ToString(ci),
                v => Y2 = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("stroke-width",
                () => StrokeWidth.ToString(ci),
                v => StrokeWidth = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("stroke",
                () => Stroke == Color.Empty ? "none" : ColorTranslator.ToSvg(Stroke),
                v => Stroke = SvgAttribute.ParseColorAttribute(v, Stroke.A)
            );

            yield return new SvgAttribute("stroke-opacity", "1",
                () => ((double)Stroke.A / 255).ToString(ci),
                v => Stroke = SvgAttribute.ParseOpacityAttribute(v, Stroke)
            );

            yield return new SvgAttribute("stroke-dashoffset",
                () => StrokeDashOffset.ToString(ci),
                v => StrokeDashOffset = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("stroke-dasharray",
                () => DashArrayToString(),
                v => StrokeDashArray = SvgAttribute.ParseFloatArray(v)
            );
        }

        private string DashArrayToString()
        {
            string dashArray = null;
            if (StrokeDashArray != null && StrokeDashArray.Count > 0)
            {
                dashArray = string.Join(" ",
                StrokeDashArray.ConvertAll(v => v.ToString(CultureInfo.InvariantCulture)).ToArray());
            }
            return dashArray;
        }
    }
}