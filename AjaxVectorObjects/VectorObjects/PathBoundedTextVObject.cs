// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Text;
using AdvancedPath = Aurigma.GraphicsMill.AdvancedDrawing.Path;
using Path = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class PathBoundedTextVObject : BoundedTextVObject
    {
        public PathBoundedTextVObject(string text, Path[] paths, string postScriptFontName = "ArialMT", float fontSize = 10)
            : base(text, new RectangleF(0, 0, 10, 10), postScriptFontName, fontSize)
        {
            TextMode = TextMode.PathBounded;

            BoundingPaths = paths;
        }

        public PathBoundedTextVObject()
            : this("", null, null, -1)
        {
        }

        private Path[] _boundingPaths;

        public Path[] BoundingPaths
        {
            get { return _boundingPaths; }
            set
            {
                _boundingPaths = value;
                UpdateRectangle();
            }
        }

        private bool _isVertical;

        public bool IsVertical
        {
            get { return _isVertical; }
            set
            {
                ValidRect = ValidRect && _isVertical == value;
                _isVertical = value;
            }
        }

        protected override Text CreateAdvancedText(string text, AdvancedDrawing.Graphics graphics)
        {
            var font = CreateFont(graphics);
            var dpi = graphics.DpiX;

            var pathBoundedText = new PathBoundedText(text, font)
            {
                Alignment = VOAligmnentToAdvanced(Alignment),
                Underline = Underline,
                Tracking = Tracking,
                Leading = Utils.EqualsOfFloatNumbers(0, Leading) ? font.Size * 1.2f : Leading,
                Paragraph =
                {
                    FirstLineIndent = ParagraphSettings.FirstLineIndent,
                    SpaceAfter = ParagraphSettings.SpaceAfter,
                    SpaceBefore = ParagraphSettings.SpaceBefore,
                    OverlapLines = true
                },
                Vertical = IsVertical
            };

            foreach (var boundingPath in GetTransformedPaths().Select(p => p.ToAdvancedPath()))
            {
                using (var matrix = new Matrix())
                {
                    if (!Utils.EqualsOfFloatNumbers(dpi, 72))
                        matrix.Scale(dpi / 72, dpi / 72, MatrixOrder.Append);

                    if (!Utils.EqualsOfFloatNumbers(1, HorizontalScale) || !Utils.EqualsOfFloatNumbers(1, VerticalScale))
                        matrix.Scale(1 / HorizontalScale, 1 / VerticalScale, MatrixOrder.Append);

                    boundingPath.ApplyTransform(matrix);
                }

                pathBoundedText.BoundingPaths.Add(boundingPath);
            }

            if (!Utils.EqualsOfFloatNumbers(1, HorizontalScale) || !Utils.EqualsOfFloatNumbers(1, VerticalScale))
                pathBoundedText.Transform.Scale(HorizontalScale, VerticalScale);

            var wrappingPath = GetWrappingPath(dpi);
            if (wrappingPath.Points.Count > 0)
                pathBoundedText.WrappingPaths.Add(wrappingPath);

            return pathBoundedText;
        }

        internal IEnumerable<Path> GetTransformedPaths()
        {
            if (BoundingPaths == null)
                return Enumerable.Empty<Path>();

            return BoundingPaths.Select(p =>
            {
                var transform = Transform.Clone();
                transform.Angle = 0;
                var transformedPath = (Path)p.Clone();
                transformedPath.Transform(transform, ControlCenter);

                return transformedPath;
            });
        }

        protected override List<byte> GetBytes()
        {
            var bytes = base.GetBytes();

            foreach (var boundingPath in GetTransformedPaths())
            {
                bytes.AddRange(Encoding.UTF8.GetBytes(boundingPath.ToSvgString()));
            }

            bytes.AddRange(BitConverter.GetBytes(IsVertical));

            return bytes;
        }

        private void UpdateRectangle()
        {
            if (BoundingPaths == null || BoundingPaths.Length == 0)
                return;

            var union = BoundingPaths[0].ToAdvancedPath();
            for (var i = 1; i < BoundingPaths.Length; i++)
            {
                union = AdvancedPath.Union(union, BoundingPaths[i].ToAdvancedPath());
            }

            var rectangle = union.GetBounds();
            ChangeControlPoints(rectangle.X, rectangle.Y, rectangle.Right, rectangle.Bottom);
        }

        public override VObjectData GetVObjectData()
        {
            return new PathBoundedTextVObjectData(this);
        }

        public override string GetVObjectDataType()
        {
            return "PathBoundedTextVObjectData";
        }

        public override void Accept(IVObjectVisitor visitor)
        {
            visitor.Visit(this);
        }
    }
}