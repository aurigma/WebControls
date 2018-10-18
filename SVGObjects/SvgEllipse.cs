// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;

namespace Aurigma.Svg
{
    public class SvgEllipse : SvgGraphicElement
    {
        private readonly string _name = "ellipse";

        public SvgEllipse()
        {
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

        public float Cx { get; set; }

        public float Cy { get; set; }

        public float Rx { get; set; }

        public float Ry { get; set; }

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

            yield return new SvgAttribute("cx", "0",
                () => Cx.ToString(ci),
                v => Cx = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("cy", "0",
                () => Cy.ToString(ci),
                v => Cy = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("rx", "0",
                () => Rx.ToString(ci),
                v => Rx = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("ry", "0",
                () => Ry.ToString(ci),
                v => Ry = SvgAttribute.ParseFloatAttribute(v)
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
    }
}