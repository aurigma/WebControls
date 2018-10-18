// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;
using System.Globalization;

namespace Aurigma.Svg
{
    public class SvgImage : SvgGraphicElement
    {
        private readonly string _name = "image";

        public float X { get; set; }

        public float Y { get; set; }

        public float Width { get; set; }

        public float Height { get; set; }

        public string Src { get; set; }

        public string PreserveAspectRatio { get; set; }

        public override string LocalName
        {
            get { return this._name; }
        }

        public override string Name
        {
            get { return this._name; }
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

            yield return new SvgAttribute("x", "0",
                () => X.ToString(ci),
                value => X = SvgAttribute.ParseFloatAttribute(value)
            );

            yield return new SvgAttribute("y", "0",
                () => Y.ToString(ci),
                value => Y = SvgAttribute.ParseFloatAttribute(value)
            );

            yield return new SvgAttribute("width", "0",
                () => Width.ToString(ci),
                value => Width = SvgAttribute.ParseFloatAttribute(value)
            );

            yield return new SvgAttribute("height", "0",
                () => Height.ToString(ci),
                value => Height = SvgAttribute.ParseFloatAttribute(value)
            );

            yield return new SvgAttribute("href", "", XmlNamespace.Xlink,
                () => Src,
                value => Src = value
            );

            yield return new SvgAttribute("preserveAspectRatio",
                () => PreserveAspectRatio,
                value => PreserveAspectRatio = value
            );
        }
    }
}