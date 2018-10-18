// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System.Collections.Generic;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class BoundedTextVObjectData : BaseTextVObjectData
    {
        public BoundedTextVObjectData()
        { }

        public BoundedTextVObjectData(BoundedTextVObject obj)
            : base(obj)
        {
            WR = obj.WrappingRectangles;
            WM = obj.WrappingMargin;
            PS = obj.ParagraphSettings;
            VA = obj.VerticalAlignment;
            IV = obj.IsVertical;
        }

        public override void ApplyState(VObject obj)
        {
            base.ApplyState(obj);

            var t = (BoundedTextVObject)obj;
            t.WrappingRectangles = WR;
            t.WrappingMargin = WM;
            t.ParagraphSettings = PS;
            t.VerticalAlignment = VA;
            t.IsVertical = IV;
        }

        /// <summary>
        /// WrappingRectangles
        /// </summary>
        public List<RotatedRectangleF> WR { get; set; }

        /// <summary>
        /// WrappingMargin
        /// </summary>
        public float WM { get; set; }

        /// <summary>
        /// ParagraphSettings
        /// </summary>
        public ParagraphSettings PS { get; set; }

        /// <summary>
        /// VerticalAlignment
        /// </summary>
        public TextVerticalAlignment VA { get; set; }

        /// <summary>
        /// IsVertical
        /// </summary>
        public bool IV { get; set; }
    }
}