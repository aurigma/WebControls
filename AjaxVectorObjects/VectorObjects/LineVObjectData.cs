// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class LineVObjectData : BaseRectangleVObjectData
    {
        public LineVObjectData()
        { }

        public LineVObjectData(LineVObject obj)
            : base(obj)
        {
            C = obj.Color;
            W = obj.Width;
            FW = obj.FixedWidth;
        }

        public override void ApplyState(VObject obj)
        {
            base.ApplyState(obj);
            var l = (LineVObject)obj;
            l.Color = C;
            l.Width = W;
            l.FixedWidth = FW;
        }

        /// <summary>
        /// Color
        /// </summary>
        public Color C { get; set; }

        /// <summary>
        /// Width
        /// </summary>
        public float W { get; set; }

        /// <summary>
        /// FixedWidth
        /// </summary>
        public bool FW { get; set; }
    }
}