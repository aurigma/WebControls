// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.Codecs;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using System.Xml.XPath;
using PointF = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public static class Common
    {
        private static Regex htmlRGBA = new Regex(@"^\s*rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\,\s*(\d{1,}(\.\d{1,})?)\s*\)\s*;{0,1}\s*$", RegexOptions.Compiled);
        private static Regex htmlRGB = new Regex(@"^\s*rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*;{0,1}\s*$", RegexOptions.Compiled);
        private static Regex htmlCMYK = new Regex(@"^\s*device-cmyk\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\,\s*(\d{1,3})\s*(\,\s*(\d{1,}(\.\d{1,})?))?\s*(\,\s*(.*)\s*)?\)\s*;{0,1}\s*$", RegexOptions.Compiled);

        private static Regex gmXmlRGBA = new Regex(@"^\s*rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\,\s*(\d{1,3})\s*\)\s*;{0,1}\s*$", RegexOptions.Compiled);
        private static Regex gmXmlRGB = new Regex(@"^\s*rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*;{0,1}\s*$", RegexOptions.Compiled);
        private static Regex gmXmlCMYK = new Regex(@"^\s*cmyk\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\,\s*(\d{1,3})\s*(\,\s*(\d{1,3}))?\s*\)\s*;{0,1}\s*$", RegexOptions.Compiled);

        public static string ConvertToWebColor(RgbColor color)
        {
            var alpha = (float)color.A / 255;
            return String.Format("rgba({0},{1},{2},{3})", color.R, color.G, color.B,
                alpha.ToString(CultureInfo.InvariantCulture.NumberFormat));
        }

        public static Color ParseWebColor(string color)
        {
            var match = htmlRGBA.Match(color);
            if (match.Success)
            {
                var r = Convert.ToByte(match.Groups[1].Value);
                var g = Convert.ToByte(match.Groups[2].Value);
                var b = Convert.ToByte(match.Groups[3].Value);

                var alpha = Convert.ToDouble(match.Groups[4].Value, CultureInfo.InvariantCulture.NumberFormat) * 255;
                alpha = System.Math.Min(255, System.Math.Max(0, alpha));
                var a = Convert.ToByte(alpha);

                return new RgbColor(r, g, b, a);
            }

            match = htmlRGB.Match(color);
            if (match.Success)
            {
                var r = Convert.ToByte(match.Groups[1].Value);
                var g = Convert.ToByte(match.Groups[2].Value);
                var b = Convert.ToByte(match.Groups[3].Value);

                return new RgbColor(r, g, b, 255);
            }

            match = htmlCMYK.Match(color);
            if (match.Success)
            {
                var c = Convert.ToByte(match.Groups[1].Value);
                var m = Convert.ToByte(match.Groups[2].Value);
                var y = Convert.ToByte(match.Groups[3].Value);
                var k = Convert.ToByte(match.Groups[4].Value);

                byte a = 255;
                if (!String.IsNullOrEmpty(match.Groups[6].Value))
                {
                    var alpha = Convert.ToDouble(match.Groups[6].Value, CultureInfo.InvariantCulture.NumberFormat) * 255;
                    alpha = System.Math.Min(255, System.Math.Max(0, alpha));
                    a = Convert.ToByte(alpha);
                }

                return new CmykColor(c, m, y, k, a);
            }

            return ColorTranslator.FromHtml(color);
        }

        public static string ConvertToGmXmlColor(Color color)
        {
            var rgbColor = color as RgbColor;
            if (rgbColor != null)
            {
                return String.Format("rgb({0},{1},{2},{3})", rgbColor.R, rgbColor.G, rgbColor.B, rgbColor.A);
            }
            var cmykColor = color as CmykColor;
            if (cmykColor != null)
            {
                return String.Format("cmyk({0},{1},{2},{3},{4})",
                    cmykColor.C,
                    cmykColor.M,
                    cmykColor.Y,
                    cmykColor.K,
                    cmykColor.A);
            }

            return color.ToString();
        }

        public static Color ParseGmXmlColor(string color)
        {
            var match = gmXmlRGBA.Match(color);
            if (match.Success)
            {
                var r = Convert.ToByte(match.Groups[1].Value);
                var g = Convert.ToByte(match.Groups[2].Value);
                var b = Convert.ToByte(match.Groups[3].Value);
                var a = Convert.ToByte(match.Groups[4].Value);

                return new RgbColor(r, g, b, a);
            }

            match = gmXmlRGB.Match(color);
            if (match.Success)
            {
                var r = Convert.ToByte(match.Groups[1].Value);
                var g = Convert.ToByte(match.Groups[2].Value);
                var b = Convert.ToByte(match.Groups[3].Value);

                return new RgbColor(r, g, b, 255);
            }

            match = gmXmlCMYK.Match(color);
            if (match.Success)
            {
                var c = Convert.ToByte(match.Groups[1].Value);
                var m = Convert.ToByte(match.Groups[2].Value);
                var y = Convert.ToByte(match.Groups[3].Value);
                var k = Convert.ToByte(match.Groups[4].Value);

                byte a = 255;
                if (!String.IsNullOrEmpty(match.Groups[6].Value))
                {
                    a = Convert.ToByte(match.Groups[6].Value);
                }

                return new CmykColor(c, m, y, k, a);
            }

            return new RgbColor();
        }

        public static int ConvertPointsToPixels(float dpi, float points)
        {
            return UnitConverter.ConvertUnitsToPixels(dpi, points, Unit.Point);
        }

        public static float ConvertPointsToPixelsFloat(float dpi, float points)
        {
            return points / 72 * dpi;
        }

        /// <summary>
        /// Convert point coordinate in points to point in pixels coordinate
        /// </summary>
        /// <param name="dpi">DPI</param>
        /// <param name="point">Point in points coordinate</param>
        /// <returns>Point in pixels coordinate</returns>
        public static PointF ConvertPointsToPixelsFloat(float dpi, PointF point)
        {
            var d = dpi / 72d;
            return point.Clone().Scale(d, d);
        }

        public static float ConvertPixelsToPoints(float dpi, int pixels)
        {
            return UnitConverter.ConvertPixelsToUnits(dpi, pixels, Unit.Point);
        }

        public static float ConvertPixelsToPoints(float dpi, float pixels)
        {
            return pixels / dpi * 72;
        }

        public static NumberFormatInfo GetNumberFormat()
        {
            var format = new NumberFormatInfo { CurrencyDecimalSeparator = "." };
            return format;
        }

        public static string GetTempFilePath(FileFormat format)
        {
            var ext = GetImageExtension(format);
            return ext != null ? GetTempFilePath(ext) : "tmp";
        }

        public static string GetTempFilePath(string extension)
        {
            return Path.Combine(Configuration.Instance.TempDirectory, Guid.NewGuid() + "." + extension);
        }

        /// <summary>
        /// Determine default file extension based on image format
        /// </summary>
        /// <param name="imageStream">Image stream</param>
        /// <returns>Extension string or null if format is not recognized</returns>
        public static string GetImageExtension(Stream imageStream)
        {
            var position = imageStream.CanSeek ? imageStream.Position : -1;
            var format = ImageReader.RecognizeFormat(imageStream);

            if (imageStream.CanSeek && position >= 0)
                imageStream.Position = position;

            return GetImageExtension(format);
        }

        /// <summary>
        /// Determine default file extension based on image format
        /// </summary>
        /// <param name="imageFile">Image stream</param>
        /// <returns>Extension string or null if format is not recognized</returns>
        public static string GetImageExtension(FileInfo imageFile)
        {
            var format = ImageReader.RecognizeFormat(imageFile.FullName);
            return GetImageExtension(format);
        }

        /// <summary>
        /// Determine default file extension based on image format
        /// </summary>
        /// <param name="format">Image format</param>
        /// <returns>Extension or null if format is unknown</returns>
        public static string GetImageExtension(FileFormat format)
        {
            if (format == FileFormat.Unknown || !Enum.IsDefined(typeof(FileFormat), format))
                return null;

            var formatStr = format.ToString().ToLowerInvariant();
            if (formatStr == "jpeg")
                formatStr = "jpg";

            return formatStr;
        }

        public static void CopyStream(Stream source, Stream destination, bool closeStream = false)
        {
            if (source != null && destination != null)
            {
                const int bufLength = 16384;
                var buffer = new Byte[bufLength];
                var bytesRead = source.Read(buffer, 0, bufLength);

                // write the required bytes
                while (bytesRead > 0)
                {
                    destination.Write(buffer, 0, bytesRead);
                    bytesRead = source.Read(buffer, 0, bufLength);
                }

                if (closeStream)
                {
                    source.Close();
                    destination.Close();
                }
            }
        }

        /// <summary>
        /// Get image size and resolution. This method doesn't load bitmap in memory.
        /// </summary>
        /// <param name="imageStream">image stream</param>
        /// <param name="imageSize">image size in pixels</param>
        /// <param name="horizontalResolution">Horizontal Resolution</param>
        /// <param name="verticalResolution">Vertical Resolution</param>
        public static void GetImageSize(Stream imageStream, out Size imageSize, out float horizontalResolution, out float verticalResolution)
        {
            using (ImageReader reader = ImageReader.Create(imageStream))
            {
                GetImageSize(reader, out imageSize, out horizontalResolution, out verticalResolution);
            }
        }

        public static void GetImageSize(string sourceStorageId, out Size imageSize, out float horizontalResolution, out float verticalResolution)
        {
            GetImageSize(Configuration.FileCache.GetSourceImageParams(sourceStorageId), out imageSize, out horizontalResolution, out verticalResolution);
        }

        /// <summary>
        /// Get image size and resolution. This method doesn't load bitmap in memory.
        /// </summary>
        /// <param name="imageFileName">image file</param>
        /// <param name="imageSize">image size in pixels</param>
        /// <param name="horizontalResolution">Horizontal Resolution</param>
        /// <param name="verticalResolution">Vertical Resolution</param>
        public static void GetImageSize(IImageParams reader, out Size imageSize, out float horizontalResolution, out float verticalResolution)
        {
            imageSize = new Size(reader.Width, reader.Height);

            horizontalResolution = reader.DpiX;
            verticalResolution = reader.DpiY;

            // BUG 0015883: Use default resolution 72, if reader return incorrect value.
            if (horizontalResolution <= 0)
            {
                horizontalResolution = 72;
            }
            if (verticalResolution <= 0)
            {
                verticalResolution = 72;
            }
        }

        public static string GetImageMimeType(string fileName)
        {
            var format = ImageReader.RecognizeFormat(fileName);
            return GetImageMimeType(format);
        }

        public static string GetImageMimeType(FileFormat imageFormat)
        {
            switch (imageFormat)
            {
                case FileFormat.Bmp:
                    return "image/bmp";

                case FileFormat.Gif:
                    return "image/gif";

                case FileFormat.Jpeg:
                    return "image/jpeg";

                case FileFormat.Pdf:
                    return "application/pdf";

                case FileFormat.Png:
                    return "image/png";

                case FileFormat.Psd:
                    return "application/psd";

                case FileFormat.Tiff:
                    return "image/tiff";

                default:
                    return "application/octet-stream";
            }
        }

        public static WriterSettings GetWriterSettings(FileFormat imageFormat)
        {
            switch (imageFormat)
            {
                case FileFormat.Bmp:
                    return new BmpSettings();

                case FileFormat.Gif:
                    return new GifSettings();

                case FileFormat.Jpeg:
                    return new JpegSettings();

                case FileFormat.Pdf:
                    return new PdfSettings();

                case FileFormat.Png:
                    return new PngSettings();

                case FileFormat.Tiff:
                    return new TiffSettings();

                default:
                    throw new ArgumentException(String.Format("Image format {0} is not supporting", imageFormat));
            }
        }

        public static bool TryParseEnum<TEnum>(string value, out TEnum result)
            where TEnum : struct, IConvertible
        {
            return Enum.TryParse(value, true, out result);
        }

        public static string XmlEscape(string unescaped)
        {
            var doc = new XmlDocument();
            XmlNode node = doc.CreateElement("root");
            node.InnerText = unescaped;
            return node.InnerXml;
        }

        public static string XmlUnescape(string escaped)
        {
            var doc = new XmlDocument();
            XmlNode node = doc.CreateElement("root");
            node.InnerXml = escaped;
            return node.InnerText;
        }

        public static void StartTask(Action action)
        {
            Task.Factory.StartNew(action);
        }

        public static string ProcessSpanStyles(string gmXml, Func<Dictionary<string, string>, bool> processStyle)
        {
            Func<XAttribute, Dictionary<string, string>> parseSpanStyle = spanStyle =>
            {
                var styleDict = spanStyle.Value.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(p =>
                    {
                        var splittedPair = p.Split(new[] { ':' }, StringSplitOptions.RemoveEmptyEntries);

                        return
                            new { key = splittedPair[0], value = splittedPair[1] };
                    })
                    .ToDictionary(o => o.key, o => o.value, StringComparer.InvariantCultureIgnoreCase);

                return styleDict;
            };

            Func<Dictionary<string, string>, string> serializeSpanStyle = styleDict =>
            {
                return styleDict
                    .Aggregate(new StringBuilder(),
                        (newStyle, pair) => newStyle.AppendFormat("{0}:{1};", pair.Key, pair.Value))
                    .ToString();
            };

            if (String.IsNullOrEmpty(gmXml))
                return gmXml;

            var xml = XDocument.Parse(String.Format("<fakeroot>{0}</fakeroot>", gmXml));
            var xmlUpdated = false;

            foreach (var span in xml.XPathSelectElements(".//span"))
            {
                var spanStyle = span.Attribute("style");
                if (spanStyle == null)
                    continue;

                var styleDict = parseSpanStyle(spanStyle);

                var spanUpdated = processStyle(styleDict);

                if (spanUpdated)
                {
                    spanStyle.Value = serializeSpanStyle(styleDict);
                    xmlUpdated = true;
                }
            }

            if (xmlUpdated)
            {
                var rootElementReader = xml.Root.CreateReader();
                rootElementReader.MoveToContent();

                gmXml = rootElementReader.ReadInnerXml();
            }

            return gmXml;
        }
    }
}