// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.Text;

namespace Aurigma.Svg
{
    public class SvgPolyline : SvgGraphicElement
    {
        private readonly string _name = "polyline";

        public SvgPolyline()
        {
            Points = new List<PointF>();
            Stroke = Color.Black;
            Fill = Color.Black;
        }

        public override string LocalName
        {
            get { return _name; }
        }

        public override string Name
        {
            get { return _name; }
        }

        public List<PointF> Points { get; private set; }

        public float StrokeWidth { get; set; }

        public Color Stroke { get; set; }

        public Color Fill { get; set; }

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

            yield return new SvgAttribute("points",
                () => PointsDataToString(Points),
                v => Points = SvgAttribute.ParsePointsDataAttribute(v)
            );

            yield return new SvgAttribute("stroke-width",
                () => StrokeWidth.ToString(ci),
                v => StrokeWidth = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("stroke",
                () => ColorTranslator.ToSvg(Stroke),
                v => Stroke = SvgAttribute.ParseColorAttribute(v, Stroke.A)
            );

            yield return new SvgAttribute("stroke-opacity", "1",
                () => ((double)Stroke.A / 255).ToString(ci),
                v => Stroke = SvgAttribute.ParseOpacityAttribute(v, Stroke)
            );

            yield return new SvgAttribute("fill",
                () => Fill.A == 0 ? "none" : ColorTranslator.ToSvg(Fill),
                v => Fill = SvgAttribute.ParseColorAttribute(v, Fill.A)
            );

            yield return new SvgAttribute("fill-opacity", "1",
                () => ((double)Fill.A / 255).ToString(ci),
                v => Fill = SvgAttribute.ParseOpacityAttribute(v, Fill)
            );
        }

        private string PointsDataToString(IEnumerable<PointF> points)
        {
            var ci = CultureInfo.InvariantCulture;
            var sb = new StringBuilder();

            if (points != null)
            {
                foreach (var p in points)
                {
                    sb.Append(p.X.ToString(ci));
                    sb.Append(',');
                    sb.Append(p.Y.ToString(ci));
                    sb.Append(' ');
                }

                if (sb.Length > 0)
                {
                    sb.Remove(sb.Length - 1, 1);
                }
            }

            return sb.ToString();
        }
    }
}