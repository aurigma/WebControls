// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;

namespace Aurigma.Svg
{
    public class SvgPath : SvgElement
    {
        private readonly string _name = "path";

        public SvgPath()
        {
            Path = new List<PathCommand>();
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

        public List<PathCommand> Path { get; set; }

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

            yield return new SvgAttribute("fill", "",
                () => ColorTranslator.ToSvg(Fill),
                v => Fill = SvgAttribute.ParseColorAttribute(v, Fill.A)
            );

            yield return new SvgAttribute("fill-opacity", "1",
                () => ((double)Fill.A / 255).ToString(ci),
                v => Fill = SvgAttribute.ParseOpacityAttribute(v, Fill)
            );

            yield return new SvgAttribute("d",
                () => PathCommand.ToSvgString(Path),
                v => Path = PathCommand.ParseCommands(v)
            );
        }
    }
}