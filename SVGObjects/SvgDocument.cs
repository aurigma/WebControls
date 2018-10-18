// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;

namespace Aurigma.Svg
{
    public class SvgDocument : SvgNode
    {
        private readonly string _name = "svg";

        public SvgDocument()
        {
        }

        public override string Name
        {
            get { return this._name; }
        }

        public override string LocalName
        {
            get { return this._name; }
        }

        public string ID { get; set; }

        public float Width { get; set; }

        public float Height { get; set; }

        public string Version
        {
            get { return "1.1"; }
        }

        public RectangleF ViewBox { get; set; }

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

            yield return new SvgAttribute("id", () => this.ID, v => this.ID = v);

            yield return new SvgAttribute("width",
                () => this.Width.ToString(CultureInfo.InvariantCulture),
                v => this.Width = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("height",
                () => this.Height.ToString(CultureInfo.InvariantCulture),
                v => this.Height = SvgAttribute.ParseFloatAttribute(v)
            );

            var ci = CultureInfo.InvariantCulture;
            var viewBox = string.Format("{0},{1},{2},{3}",
                ViewBox.X.ToString(ci), ViewBox.Y.ToString(ci),
                ViewBox.Width.ToString(ci), ViewBox.Height.ToString(ci));
            yield return new SvgAttribute("viewBox",
                () => viewBox,
                value => ViewBox = SvgAttribute.ParseViewBoxAttribute(value)
            );

            yield return new SvgAttribute("version",
                () => this.Version,
                v => { } // Readonly property
            );
        }
    }
}