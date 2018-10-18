// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.Codecs;
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileCache
{
    public class SourceImageParams : ISourceImageParams
    {
        public SourceImageParams(ImageReader reader)
        {
            FileFormat = reader.FileFormat;

            Width = reader.Width;
            Height = reader.Height;
            DpiX = reader.DpiX;
            DpiY = reader.DpiY;
            PixelFormat = reader.PixelFormat;
        }

        public FileFormat FileFormat { get; private set; }

        public int Width { get; private set; }
        public int Height { get; private set; }
        public float DpiX { get; private set; }
        public float DpiY { get; private set; }
        public PixelFormat PixelFormat { get; private set; }

        public ColorPalette Palette { get { throw new NotSupportedException(); } }
        public ColorProfile ColorProfile { get { throw new NotSupportedException(); } }
        public Ink Ink { get { throw new NotSupportedException(); } }
    }
}