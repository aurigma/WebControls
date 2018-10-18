// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.Svg;
using System.Collections.Generic;
using System.Globalization;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class SvgVoRectangle : SvgRect
    {
        private string _fillColor;
        private string _borderColor;

        public bool FixedBorderWidth { get; set; }

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

            yield return new SvgAttribute("fixed-border-width", "false", XmlNamespace.AurigmaVectorObjects,
                () => FixedBorderWidth.ToString(CultureInfo.InvariantCulture).ToLowerInvariant(),
                v => FixedBorderWidth = v == "true"
            );

            yield return new SvgAttribute("fill-color", "", XmlNamespace.AurigmaVectorObjects,
                () => _fillColor,
                v => _fillColor = v
            );

            yield return new SvgAttribute("border-color", "", XmlNamespace.AurigmaVectorObjects,
                () => _borderColor,
                v => _borderColor = v
            );
        }

        internal void SetFillColor(Color color, RgbColor preview, JsonVOSerializer serializer)
        {
            Fill = preview;
            _fillColor = serializer.Serialize(color);
        }

        internal Color GetFillColor(JsonVOSerializer serializer)
        {
            return !string.IsNullOrEmpty(_fillColor) ? serializer.Deserialize<Color>(_fillColor) : new RgbColor(Fill);
        }

        internal void SetBorderColor(Color color, RgbColor preview, JsonVOSerializer serializer)
        {
            Stroke = preview;
            _borderColor = serializer.Serialize(color);
        }

        internal Color GetBorderColor(JsonVOSerializer serializer)
        {
            return !string.IsNullOrEmpty(_borderColor) ? serializer.Deserialize<Color>(_borderColor) : new RgbColor(Stroke);
        }
    }
}