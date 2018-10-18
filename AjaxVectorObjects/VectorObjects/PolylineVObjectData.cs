// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    internal class PolylineVObjectData : BaseRectangleVObjectData
    {
        public PolylineVObjectData()
        { }

        public PolylineVObjectData(PolylineVObject obj)
            : base(obj)
        {
            W = obj.Width;
            C = obj.Color;
        }

        public override void ApplyState(VObject obj)
        {
            base.ApplyState(obj);
            var l = (PolylineVObject)obj;
            l.Width = W;
            l.Color = C;
        }

        /// <summary>
        /// Width
        /// </summary>
        public float W { get; set; }

        /// <summary>
        /// Color
        /// </summary>
        public Color C { get; set; }
    }
}