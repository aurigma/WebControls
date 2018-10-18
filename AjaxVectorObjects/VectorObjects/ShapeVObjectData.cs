// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System.Drawing;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class ShapeVObjectData : BaseRectangleVObjectData
    {
        public ShapeVObjectData()
        {
        }

        public ShapeVObjectData(ShapeVObject obj)
            : base(obj)
        {
            Pth = obj.Path.ToSvgString();
            BC = obj.BorderColor;
            BW = obj.BorderWidth;
            FC = obj.FillColor;
            FBW = obj.FixedBorderWidth;
        }

        public override void ApplyState(VObject obj)
        {
            base.ApplyState(obj);

            var s = (ShapeVObject)obj;

            // Backward compatibility
            if (Pth == null)
            {
                var rectangle = new RectangleF(P[0].X, P[0].Y, P[1].X - P[0].X, P[1].Y - P[0].Y);
                s.Path = obj is EllipseVObject ? Path.CreateEllipsePath(rectangle) : Path.CreateRectanglePath(rectangle);
            }
            else
            {
                s.Path = Path.FromSvgString(Pth);
            }

            s.FillColor = FC;
            s.BorderColor = BC;
            s.BorderWidth = BW;
            s.FixedBorderWidth = FBW;
        }

        /// <summary>
        /// Path
        /// </summary>
        public string Pth { get; set; }

        /// <summary>
        /// BorderColor
        /// </summary>
        public Color BC { get; set; }

        /// <summary>
        /// FillColor
        /// </summary>
        public Color FC { get; set; }

        /// <summary>
        /// BorderWidth
        /// </summary>
        public float BW { get; set; }

        /// <summary>
        /// FixedBorderWidth
        /// </summary>
        public bool FBW { get; set; }
    }
}