// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    internal class DashedLineVObjectData : LineVObjectData
    {
        public DashedLineVObjectData()
        { }

        public DashedLineVObjectData(DashedLineVObject obj)
            : base(obj)
        {
            DW = obj.DashWidth;
            ADW = obj.AltDashWidth;
            AC = obj.AltColor;
        }

        public override void ApplyState(VObject obj)
        {
            base.ApplyState(obj);
            var l = (DashedLineVObject)obj;
            l.AltColor = AC;
            l.DashWidth = DW;
            l.AltDashWidth = ADW;
        }

        /// <summary>
        /// DashWidth
        /// </summary>
        public float DW { get; set; }

        /// <summary>
        /// AltColor
        /// </summary>
        public Color AC { get; set; }

        /// <summary>
        /// AltDashWidth
        /// </summary>
        public float ADW { get; set; }
    }
}