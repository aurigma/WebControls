// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    internal class GridVObjectData : BaseRectangleVObjectData
    {
        public GridVObjectData()
        { }

        public GridVObjectData(GridVObject obj)
            : base(obj)
        {
            C = obj.Cols;
            R = obj.Rows;
            SX = obj.StepX;
            SY = obj.StepY;
            HLC = obj.HorizontalLineColor;
            VLC = obj.VerticalLineColor;
            LW = obj.LineWidth;
            FLW = obj.FixedLineWidth;
        }

        public override void ApplyState(VObject obj)
        {
            base.ApplyState(obj);
            var grid = (GridVObject)obj;
            grid.Cols = C;
            grid.Rows = R;
            grid.StepX = SX;
            grid.StepY = SY;
            grid.HorizontalLineColor = HLC;
            grid.VerticalLineColor = VLC;
            grid.LineWidth = LW;
            grid.FixedLineWidth = FLW;
        }

        /// <summary>
        /// Cols
        /// </summary>
        public int C { get; set; }

        /// <summary>
        /// Rows
        /// </summary>
        public int R { get; set; }

        /// <summary>
        /// StepX
        /// </summary>
        public float SX { get; set; }

        /// <summary>
        /// StepY
        /// </summary>
        public float SY { get; set; }

        /// <summary>
        /// LineWidth
        /// </summary>
        public float LW { get; set; }

        /// <summary>
        /// HorizontalLineColor
        /// </summary>
        public Color HLC { get; set; }

        /// <summary>
        /// VerticalLineColor
        /// </summary>
        public Color VLC { get; set; }

        /// <summary>
        /// FixedLineWidth
        /// </summary>
        public bool FLW { get; set; }
    }
}