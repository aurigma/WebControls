// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.Transforms;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    internal class ColorMap : IDisposable
    {
        private readonly Color[] _rgbColors;
        private readonly Color[] _cmykColors;
        private readonly Color[] _grayscaleColors;

        private Bitmap _rgbBitmap;
        private Bitmap _cmykBitmap;
        private Bitmap _grayscaleBitmap;

        public ColorMap(IEnumerable<Color> colors)
        {
            var rgbColors = new List<Color>();
            var cmykColors = new List<Color>();
            var grayscaleColors = new List<Color>();

            foreach (var color in colors)
            {
                var rgb = color as RgbColor;
                if (rgb != null && !rgbColors.Contains(rgb))
                {
                    rgbColors.Add(rgb);
                    continue;
                }

                var cmyk = color as CmykColor;
                if (cmyk != null && !cmykColors.Contains(cmyk))
                {
                    cmykColors.Add(cmyk);
                    continue;
                }

                var grayscale = color as GrayscaleColor;
                if (grayscale != null && !grayscaleColors.Contains(grayscale))
                    grayscaleColors.Add(grayscale);
            }

            _rgbColors = rgbColors.ToArray();
            _cmykColors = cmykColors.ToArray();
            _grayscaleColors = grayscaleColors.ToArray();
        }

        public void Dispose()
        {
            if (_rgbBitmap != null)
                _rgbBitmap.Dispose();

            if (_cmykBitmap != null)
                _cmykBitmap.Dispose();

            if (_grayscaleBitmap != null)
                _grayscaleBitmap.Dispose();
        }

        public IEnumerable<ColorSpace> ColorSpaces
        {
            get
            {
                if (_rgbColors.Length > 0)
                    yield return ColorSpace.Rgb;

                if (_cmykColors.Length > 0)
                    yield return ColorSpace.Cmyk;

                if (_grayscaleColors.Length > 0)
                    yield return ColorSpace.Grayscale;
            }
        }

        public void Convert(ColorConverter converter, ColorSpace colorSpace)
        {
            var colors = GetColors(colorSpace);
            var bitmap = GetBitmap(colorSpace);

            if (bitmap != null)
                bitmap.Dispose();

            bitmap = new Bitmap();

            if (colors.Length <= 0)
                return;

            using (var source = new Bitmap(colors.Length, 1, ColorManagement.GetPixelFormat(colorSpace)))
            {
                for (var i = 0; i < colors.Length; i++)
                {
                    source.SetPixel(i, 0, colors[i]);
                }

                Pipeline.Run(source + converter + bitmap);
            }

            SetBitmap(bitmap, colorSpace);
        }

        public Color GetColor(Color color)
        {
            var bitmap = GetBitmap(color.ColorSpace);
            if (bitmap == null)
                return null;

            var colors = GetColors(color.ColorSpace);
            var index = Array.IndexOf(colors, color);
            return index == -1 ? null : bitmap.GetPixel(index, 0);
        }

        public bool ContainsColors(IEnumerable<Color> colors)
        {
            foreach (var color in colors)
            {
                switch (color.ColorSpace)
                {
                    case ColorSpace.Rgb:
                        if (!_rgbColors.Contains(color))
                            return false;
                        break;

                    case ColorSpace.Cmyk:
                        if (!_cmykColors.Contains(color))
                            return false;
                        break;

                    case ColorSpace.Grayscale:
                        if (!_grayscaleColors.Contains(color))
                            return false;
                        break;
                }
            }

            return true;
        }

        private Color[] GetColors(ColorSpace colorSpace)
        {
            switch (colorSpace)
            {
                case ColorSpace.Rgb:
                    return _rgbColors;

                case ColorSpace.Cmyk:
                    return _cmykColors;

                case ColorSpace.Grayscale:
                    return _grayscaleColors;

                default:
                    throw new ArgumentException(@"Unsupported color space", "colorSpace");
            }
        }

        private Bitmap GetBitmap(ColorSpace colorSpace)
        {
            switch (colorSpace)
            {
                case ColorSpace.Rgb:
                    return _rgbBitmap;

                case ColorSpace.Cmyk:
                    return _cmykBitmap;

                case ColorSpace.Grayscale:
                    return _grayscaleBitmap;

                default:
                    throw new ArgumentException(@"Unsupported color space", "colorSpace");
            }
        }

        private void SetBitmap(Bitmap bitmap, ColorSpace colorSpace)
        {
            switch (colorSpace)
            {
                case ColorSpace.Rgb:
                    _rgbBitmap = bitmap;
                    break;

                case ColorSpace.Cmyk:
                    _cmykBitmap = bitmap;
                    break;

                case ColorSpace.Grayscale:
                    _grayscaleBitmap = bitmap;
                    break;

                default:
                    throw new ArgumentException(@"Unsupported color space", "colorSpace");
            }
        }
    }
}