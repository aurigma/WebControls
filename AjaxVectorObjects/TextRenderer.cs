// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using Aurigma.GraphicsMill.Codecs;
using System;
using System.Drawing;
using System.Globalization;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class TextRenderer
    {
        private const FileFormat _fileFormat = FileFormat.Png;
        private const ColorSpace _colorSpace = ColorSpace.Rgb;

        public static string RenderToFile(BaseTextVObject vObject, float dpi)
        {
            var fileId = CreateFileId(vObject.GetMD5(dpi));

            if (Configuration.FileCache.FileExists(fileId))
                return fileId;

            try
            {
                var bitmap = GetTextBitmap(vObject, dpi, out fileId);
                Configuration.FileCache.WriteToStream(fileId, stream =>
                {
                    bitmap.Save(stream, Common.GetWriterSettings(_fileFormat));
                    bitmap.Dispose();
                });
            }
            catch (Exception)
            {
                Configuration.FileCache.RemoveFile(fileId);
                throw;
            }

            return fileId;
        }

        private static string CreateFileId(string hash)
        {
            return string.Format(CultureInfo.InvariantCulture, "txt{0}.{1}", hash, Common.GetImageExtension(_fileFormat));
        }

        internal static Bitmap GetTextBitmap(BaseTextVObject vObject, float dpi, Point location, bool extendBitmap = false)
        {
            string id;
            return GetTextBitmap(vObject, dpi, location, extendBitmap, out id);
        }

        private static Bitmap GetTextBitmap(BaseTextVObject vObject, float dpi, out string id)
        {
            return GetTextBitmap(vObject, dpi, new Point(1, 1), false, out id);
        }

        private static Bitmap GetTextBitmap(BaseTextVObject vObject, float dpi, Point location, bool extendBitmap, out string id)
        {
            if (vObject == null)
                throw new ArgumentNullException("vObject");

            if (dpi <= 0)
                throw new ArgumentOutOfRangeException("dpi");

            var rect = vObject.MeasureText(dpi);
            var width = (int)System.Math.Ceiling(rect.Width + (extendBitmap ? location.X * 2 : 0));
            var height = (int)System.Math.Ceiling(rect.Height + (extendBitmap ? location.Y * 2 : 0));

            if (rect.IsEmpty)
                throw new InvalidOperationException("TextRenderer cannot write a text bitmap because it is empty");

            var scale = dpi / vObject.TargetDpi ?? 1;
            var colorManagement = vObject.GetColorManagement(true);
            var textBitmap = new Bitmap(width, height, ColorManagement.GetPixelFormat(_colorSpace), RgbColor.Transparent)
            {
                DpiX = dpi / scale,
                DpiY = dpi / scale,
                ColorProfile = ColorManagement.GetProfile(colorManagement, _colorSpace, true)
            };

            using (var graphics = textBitmap.GetAdvancedGraphics())
            {
                graphics.Transform.Translate(-rect.X + location.X, -rect.Y + location.Y);

                if (!Utils.EqualsOfFloatNumbers(scale, 1))
                    graphics.Transform.Scale(scale, scale);

                var angle = vObject.Angle;
                var opacity = vObject.Opacity;

                var curvedText = vObject as CurvedTextVObject;
                if (curvedText != null)
                    curvedText.TextPath.RotateAt(-angle, curvedText.TextPath.GetFirstPoint());

                vObject.Transform.Update(null, null, null, null, 0);
                vObject.Opacity = 1;

                vObject.DrawText(graphics, textBitmap, colorManagement);

                if (curvedText != null)
                    curvedText.TextPath.RotateAt(angle, curvedText.TextPath.GetFirstPoint());

                vObject.Transform.Update(null, null, null, null, angle);
                vObject.Opacity = opacity;
            }

            textBitmap.DpiX = dpi;
            textBitmap.DpiY = dpi;

            id = CreateFileId(vObject.GetMD5(dpi));

            return textBitmap;
        }
    }
}