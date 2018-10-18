// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.Svg;
using System.Collections.Generic;
using System.Globalization;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class SvgVoBoundedText : SvgVoText
    {
        public string WrappingRectanglesJson { get; set; }
        public float WrappingMargin { get; set; }
        public string ParagraphSettingsJson { get; set; }
        public TextVerticalAlignment VerticalAlignment { get; set; }
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

            yield return new SvgAttribute("wrapping-rectanlges", null,
                XmlNamespace.AurigmaVectorObjects,
                () => WrappingRectanglesJson,
                v => WrappingRectanglesJson = v
                );

            yield return new SvgAttribute("wrapping-margin", null,
                XmlNamespace.AurigmaVectorObjects,
                () => WrappingMargin.ToString(CultureInfo.InvariantCulture),
                v => WrappingMargin = SvgAttribute.ParseFloatAttribute(v)
                );

            yield return new SvgAttribute("paragraph-settings", null,
                XmlNamespace.AurigmaVectorObjects,
                () => ParagraphSettingsJson,
                v => ParagraphSettingsJson = v
                );

            yield return new SvgAttribute("vertical-alignment", TextVerticalAlignment.Top.ToString().ToLowerInvariant(),
                XmlNamespace.AurigmaVectorObjects,
                () => VerticalAlignment.ToString().ToLowerInvariant(),
                v => VerticalAlignment = SvgAttribute.ParseEnumAttribute<TextVerticalAlignment>(v)
                );

            yield return new SvgAttribute("is-vertical", bool.FalseString,
                () => IsVertical.ToString(),
                v => IsVertical = SvgAttribute.ParseBooleanAttribute(v)
            );
        }
    }
}