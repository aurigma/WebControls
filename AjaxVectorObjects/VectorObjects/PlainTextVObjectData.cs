// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class PlainTextVObjectData : BaseTextVObjectData
    {
        public PlainTextVObjectData()
        { }

        public PlainTextVObjectData(PlainTextVObject obj)
            : base(obj)
        {
            BL = obj.BaselineLocation;
            AA = obj.ActualAngle;
            IV = obj.IsVertical;
        }

        public override void ApplyState(VObject obj)
        {
            base.ApplyState(obj);

            var t = (PlainTextVObject)obj;
            t.BaselineLocation = BL;
            t.ActualAngle = AA;
            t.IsVertical = IV;
        }

        /// <summary>
        /// BaselineLocation
        /// </summary>
        public System.Drawing.PointF BL { get; set; }

        /// <summary>
        /// ActualAngle
        /// </summary>
        public double AA { get; set; }

        /// <summary>
        /// IsVertical
        /// </summary>
        public bool IV { get; set; }
    }
}