// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Web;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class SvgVObjectData : ShapeVObjectData
    {
        public SvgVObjectData()
        {
        }

        public SvgVObjectData(SvgVObject obj)
            : base(obj)
        {
            S = HttpUtility.HtmlEncode(obj.Svg);
            SC = obj.StrokeColor;
        }

        public override void ApplyState(VObject obj)
        {
            base.ApplyState(obj);
            var s = (SvgVObject)obj;
            s.Svg = HttpUtility.HtmlDecode(S);
            s.StrokeColor = SC;
        }

        /// <summary>
        /// Svg
        /// </summary>
        public string S { get; set; }

        /// <summary>
        /// Stroke Color
        /// </summary>
        public Color SC { get; set; }
    }
}