// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class ContentVObjectData : ShapeVObjectData
    {
        public ContentVObjectData()
        {
        }

        public ContentVObjectData(ContentVObject obj)
            : base(obj)
        {
            MC = Common.ConvertToWebColor(obj.MaskColor);
        }

        public override void ApplyState(VObject obj)
        {
            base.ApplyState(obj);
            var c = (ContentVObject)obj;

            c.MaskColor = MC != null ? new RgbColor(Common.ParseWebColor(MC)) : c.MaskColor;
        }

        /// <summary>
        /// MaskColor
        /// </summary>
        public string MC { get; set; }
    }
}