// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public interface IVObjectVisitor
    {
        void Visit(RectangleVObject rectangleVObject);

        void Visit(EllipseVObject ellipseVObject);

        void Visit(ImageVObject imageVObject);

        void Visit(CurvedTextVObject curvedTextVObject);

        void Visit(PlainTextVObject plainTextVObject);

        void Visit(BoundedTextVObject boundedVObject);

        void Visit(AutoScaledTextVObject autoScaledTextVObject);

        void Visit(PathBoundedTextVObject pathBoundedTextVObject);

        void Visit(PlaceholderVObject placeholderVObject);

        void Visit(LineVObject lineVObject);

        void Visit(DashedLineVObject dashedLineVObject);

        void Visit(PolylineVObject polylineVObject);

        void Visit(SvgVObject svgVObject);

        void Visit(GridVObject gridVObject);

        void Visit(ShapeVObject gridVObject);
    }
}