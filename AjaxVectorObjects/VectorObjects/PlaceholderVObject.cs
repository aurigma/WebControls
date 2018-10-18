// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing.Drawing2D;
using System.Linq;
using AdvancedPath = Aurigma.GraphicsMill.AdvancedDrawing.Path;
using Matrix = System.Drawing.Drawing2D.Matrix;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public sealed class PlaceholderVObject : ShapeVObject, IPipelineExtender
    {
        public PlaceholderVObject()
            : this(null, new RotatedRectangleF())
        {
        }

        public PlaceholderVObject(ContentVObject content)
            : this(content, content.Rectangle)
        {
        }

        public PlaceholderVObject(ContentVObject content, RotatedRectangleF placeholder)
            : this(content, Math.Path.CreateRectanglePath(placeholder.ToRectangleF()), placeholder.Angle)
        {
        }

        public PlaceholderVObject(ContentVObject content, Math.Path path, float angle)
            : base(path, angle)
        {
            BorderWidth = 0f;
            FillColor = RgbColor.Transparent;
            Content = content;
            ShowMaskedContent = true;
            IsStubContent = false;
        }

        public new object Clone()
        {
            var obj = (PlaceholderVObject)base.Clone();
            if (!IsEmptyContent)
                obj.Content = (ContentVObject)Content.Clone();

            return obj;
        }

        public override bool Visible
        {
            get { return base.Visible; }
            set
            {
                base.Visible = value;
                if (!IsEmptyContent)
                    Content.Visible = value;
            }
        }

        internal override IEnumerable<Color> GetColors()
        {
            foreach (var color in base.GetColors())
            {
                yield return color;
            }

            if (IsEmptyContent)
                yield break;

            foreach (var color in Content.GetColors())
            {
                yield return color;
            }
        }

        public override VObjectData GetVObjectData()
        {
            return new PlaceholderVObjectData(this);
        }

        public override string GetVObjectDataType()
        {
            return "PlaceholderVObjectData";
        }

        private ContentVObject _content;

        public ContentVObject Content
        {
            get { return _content; }
            set
            {
                _content = value;
                if (_content != null)
                    _content.Layer = Layer;
            }
        }

        public bool IsStubContent { get; set; }

        public bool ShowMaskedContent { get; set; }

        public bool IsEmptyContent
        {
            get { return Content == null; }
        }

        public bool IsStubOrEmptyContent
        {
            get { return IsStubContent || IsEmptyContent; }
        }

        internal override void Draw(Graphics graphics, IImageParams destImageParams, ColorManagement colorManagement)
        {
            var bounds = Bounds;
            if (bounds.Width <= 0 || bounds.Height <= 0)
                return;

            FillShape(graphics, destImageParams, colorManagement);

            if (!IsStubOrEmptyContent)
            {
                using (var clippingPath = GetClippingPath(graphics.DpiX))
                {
                    var globalClippingPath = graphics.ClippingPaths.FirstOrDefault();
                    if (globalClippingPath != null)
                    {
                        graphics.ClippingPaths.Remove(globalClippingPath);

                        using (var intersectedClippingPath = AdvancedPath.Intersect(clippingPath, globalClippingPath))
                        {
                            graphics.ClippingPaths.Add(intersectedClippingPath);
                            Content.Draw(graphics, destImageParams, colorManagement);
                            graphics.ClippingPaths.Remove(intersectedClippingPath);
                        }

                        graphics.ClippingPaths.Add(globalClippingPath);
                    }
                    else
                    {
                        graphics.ClippingPaths.Add(clippingPath);
                        Content.Draw(graphics, destImageParams, colorManagement);
                        graphics.ClippingPaths.Remove(clippingPath);
                    }
                }
            }

            StrokeShape(graphics, destImageParams, colorManagement);
        }

        private AdvancedPath GetClippingPath(float dpi = 72)
        {
            var path = GetPath();

            if (!Utils.EqualsOfFloatNumbers(dpi, 72))
            {
                using (var matrix = new Matrix())
                {
                    matrix.Scale(dpi / 72, dpi / 72, MatrixOrder.Append);
                    path.ApplyTransform(matrix);
                }
            }

            return path;
        }

        public bool CanExtendPipeline
        {
            get
            {
                return !IsStubContent && Content is ImageVObject;
            }
        }

        public void ExtendPipeline(Pipeline pipeline, IImageParams destImageParams, ColorManagement colorManagement, float scale, out IEnumerable<IDisposable> deps)
        {
            deps = new List<IDisposable>();

            if (CanExtendPipeline)
            {
                pipeline.Add(GetFillShapeDrawer(destImageParams, colorManagement, scale));

                var dpi = destImageParams.DpiX * scale;
                var alpha = new Transforms.ScaleAlpha(GetAlphaChannel(dpi, deps)) { Scale = Opacity };

                var combiner = ((ImageVObject)Content).GetImageCombiner(destImageParams, colorManagement, scale, deps, alpha);
                if (combiner != null)
                    pipeline.Add(combiner);

                pipeline.Add(GetStrokeShapeDrawer(destImageParams, colorManagement, scale));
            }
            else
                pipeline.Add(GetDrawer(destImageParams, colorManagement));
        }

        private Drawer GetFillShapeDrawer(IImageParams destImageParams, ColorManagement colorManagement, float scale)
        {
            var drawer = new Drawer();
            drawer.Draw += (sender, e) =>
            {
                if (!Utils.EqualsOfFloatNumbers(scale, 1))
                    e.Graphics.Transform.Scale(scale, scale);

                FillShape(e.Graphics, destImageParams, colorManagement);

                if (!IsStubContent)
                {
                    var clippingPath = GetClippingPath(e.Graphics.DpiX);

                    e.Graphics.ClippingPaths.Add(clippingPath);

                    Content.FillShape(e.Graphics, destImageParams, colorManagement);
                    Content.StrokeShape(e.Graphics, destImageParams, colorManagement);

                    e.Graphics.ClippingPaths.Remove(clippingPath);
                }

                if (!Utils.EqualsOfFloatNumbers(scale, 1))
                    e.Graphics.Transform.Scale(1 / scale, 1 / scale);
            };

            return drawer;
        }

        private Drawer GetStrokeShapeDrawer(IImageParams destImageParams, ColorManagement colorManagement, float scale)
        {
            var drawer = new Drawer();
            drawer.Draw += (sender, e) =>
            {
                if (!Utils.EqualsOfFloatNumbers(scale, 1))
                    e.Graphics.Transform.Scale(scale, scale);

                StrokeShape(e.Graphics, destImageParams, colorManagement);

                if (!Utils.EqualsOfFloatNumbers(scale, 1))
                    e.Graphics.Transform.Scale(1 / scale, 1 / scale);
            };

            return drawer;
        }

        private Pipeline GetAlphaChannel(float dpi, IEnumerable<IDisposable> deps)
        {
            var image = Content as ImageVObject;
            if (image == null)
                return null;

            var rect = image.GetDrawingRectangle(dpi);

            var clippingPath = GetClippingPath(dpi);
            using (var matrix = new Matrix())
            {
                rect.Angle = 0;
                matrix.RotateAt(-(float)image.Angle, rect.Center.ToPointF(), MatrixOrder.Append);
                matrix.Translate(-rect.Location.X, -rect.Location.Y, MatrixOrder.Append);
                clippingPath.ApplyTransform(matrix);
            }

            ((IList)deps).Add(clippingPath);

            var imageGenerator = new ImageGenerator((int)rect.Width, (int)rect.Height, PixelFormat.Format8bppGrayscale, RgbColor.Black);
            var drawer = new Drawer();
            drawer.Draw += (sender, e) =>
            {
                e.Graphics.FillPath(new SolidBrush(RgbColor.White), clippingPath);
            };

            return new Pipeline(imageGenerator + drawer);
        }

        public override void Accept(IVObjectVisitor visitor)
        {
            visitor.Visit(this);
        }
    }
}