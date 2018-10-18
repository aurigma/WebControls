// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class BaseRectangleVObjectData : VObjectData
    {
        public BaseRectangleVObjectData(BaseRectangleVObject obj)
            : base(obj)
        {
            TWM = obj.TextWrappingMode;
            O = obj.Opacity;
        }

        public BaseRectangleVObjectData()
        { }

        public override void ApplyState(VObject obj)
        {
            base.ApplyState(obj);

            var t = (BaseRectangleVObject)obj;
            t.TextWrappingMode = TWM;
            t.Opacity = O;
        }

        /// <summary>
        /// WrappingMode
        /// </summary>
        public TextWrappingMode TWM { get; set; }

        /// <summary>
        /// Opacity
        /// </summary>
        public float O { get; set; }
    }
}