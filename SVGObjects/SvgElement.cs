// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;
using System.Drawing.Drawing2D;
using System.Globalization;
using System.Text;

namespace Aurigma.Svg
{
    public abstract class SvgElement : SvgNode
    {
        public Matrix Transform { get; set; }

        public Display Display { get; set; }

        public string ID { get; set; }

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

            yield return new SvgAttribute("id",
                () => this.ID,
                v => this.ID = v
            );

            yield return new SvgAttribute("display", Display.Inline.ToString().ToLowerInvariant(),
                () => this.Display.ToString().ToLowerInvariant(),
                v => this.Display = SvgAttribute.ParseDisplayAttribute(v, Display.None));

            yield return new SvgAttribute("transform",
                () => TransformToString(this.Transform),
                v => Transform = SvgAttribute.ParseTransformAttribute(v));
        }

        protected string TransformToString(Matrix m)
        {
            if (m == null || m.IsIdentity)
            {
                return null;
            }

            var sb = new StringBuilder("matrix(");
            var ci = CultureInfo.InvariantCulture;
            var els = Transform.Elements;
            for (int i = 0; i < 6; i++)
            {
                sb.Append(els[i].ToString(ci));
                sb.Append(",");
            }
            sb[sb.Length - 1] = ')';
            return sb.ToString();
        }
    }
}