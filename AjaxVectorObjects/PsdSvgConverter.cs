// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg;
using Aurigma.GraphicsMill.Codecs.Psd;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using ParagraphSettings = Aurigma.GraphicsMill.AdvancedDrawing.ParagraphSettings;
using Path = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path;
using PointF = System.Drawing.PointF;
using SolidBrush = Aurigma.GraphicsMill.AdvancedDrawing.SolidBrush;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class PsdSvgConverter
    {
        private readonly ISerializer _serializer;

        public PsdSvgConverter(ISerializer serializer = null)
        {
            _serializer = serializer ?? new SvgSerializer();
        }

        public void Convert(string psdFilename, string stateFilename)
        {
            if (psdFilename == null)
                throw new ArgumentNullException("psdFilename");

            if (stateFilename == null)
                throw new ArgumentNullException("stateFilename");

            using (var inStream = File.OpenRead(psdFilename))
            using (var outStream = File.OpenWrite(stateFilename))
            {
                Convert(inStream, outStream);
            }
        }

        public void Convert(Stream psdStream, Stream stateStream)
        {
            if (psdStream == null)
                throw new ArgumentNullException("psdStream");

            if (stateStream == null)
                throw new ArgumentNullException("stateStream");

            using (var psdReader = new PsdReader(psdStream))
            {
                Convert(psdReader, stateStream);
            }
        }

        public void Convert(PsdReader psdReader, Stream stateStream)
        {
            if (psdReader == null)
                throw new ArgumentNullException("psdReader");

            if (stateStream == null)
                throw new ArgumentNullException("stateStream");

            using (var canvas = ParsePsd(psdReader))
            {
                _serializer.Serialize(canvas, stateStream);
            }
        }

        public static ICanvas ParsePsd(Stream psdStream)
        {
            if (psdStream == null)
                throw new ArgumentNullException("psdStream");

            using (var reader = new PsdReader(psdStream))
            {
                return ParsePsd(reader);
            }
        }

        public static ICanvas ParsePsd(PsdReader psdReader, bool skipGroupPrefix = false, ICanvas canvas = null)
        {
            if (psdReader == null)
                throw new ArgumentNullException("psdReader");

            if (canvas == null)
                canvas = new CanvasSlim();
            else
                canvas.Layers.Clear();

            canvas.WorkspaceWidth = Common.ConvertPixelsToPoints(psdReader.DpiX, psdReader.Width);
            canvas.WorkspaceHeight = Common.ConvertPixelsToPoints(psdReader.DpiY, psdReader.Height);

            var layer = new Layer { Name = "psd" };
            foreach (var frame in psdReader.Frames.Reverse().Where(f => f != null))
            {
                var vObject = CreateVObject(frame, skipGroupPrefix);
                if (vObject == null)
                    continue;

                if (vObject is ImageVObject)
                {
                    (vObject as ImageVObject).LoadImage(frame);
                }

                layer.VObjects.Insert(0, vObject);
            }
            canvas.Layers.Add(layer);
            return canvas;
        }

        public static VObject CreateVObject(
            PsdFrame frame,
            bool skipGroupPrefix = false,
            Regex markersRegex = null,
            bool forceRichText = false,
            bool getRichTextForBoundedTextOnly = false)
        {
            if (frame == null)
                throw new ArgumentNullException("frame");

            VObject vObject = null;
            switch (frame.Type)
            {
                case FrameType.Group:
                    break;

                case FrameType.Text:
                    vObject = CreateTextVObject((PsdTextFrame)frame, forceRichText, getRichTextForBoundedTextOnly);
                    break;

                case FrameType.Shape:
                    vObject = CreateShapeVObject((PsdShapeFrame)frame);
                    break;

                default:
                    vObject = CreateImageVObject(frame);
                    break;
            }

            if (vObject != null)
                vObject.Name = GetVObjectName(frame, skipGroupPrefix, markersRegex);

            return vObject;
        }

        public static string GetVObjectName(PsdFrame frame, bool skipGroupPrefix, Regex markersRegex)
        {
            var prefix = "";
            if (!skipGroupPrefix && frame.Parent != null)
            {
                var parts = new Stack<string>();

                var parent = frame.Parent;
                while (parent != null && parent.Name != null)
                {
                    parts.Push(parent.Name);
                    parent = parent.Parent;
                }

                prefix = string.Join("/", parts.ToArray()) + "/";
            }

            var frameName = frame.Name ?? "";
            var name = markersRegex != null ? markersRegex.Replace(frameName, "") : frameName;
            return prefix + name.Trim();
        }

        private static VObject CreateTextVObject(
            PsdTextFrame frame,
            bool forceRichText = false,
            bool getRichTextForBoundedTextOnly = false)
        {
            BaseTextVObject textVObject;

            TextAlignment aligment;
            switch (frame.Justification)
            {
                case TextJustification.Left:
                    aligment = TextAlignment.Left;
                    break;

                case TextJustification.LastLeft:
                    aligment = TextAlignment.LastLeft;
                    break;

                case TextJustification.Right:
                    aligment = TextAlignment.Right;
                    break;

                case TextJustification.LastRight:
                    aligment = TextAlignment.LastRight;
                    break;

                case TextJustification.All:
                    aligment = TextAlignment.Justify;
                    break;

                case TextJustification.Center:
                    aligment = TextAlignment.Center;
                    break;

                case TextJustification.LastCenter:
                    aligment = TextAlignment.LastCenter;
                    break;

                default:
                    aligment = TextAlignment.Left;
                    break;
            }

            var transform = GetTransformFromPsdMatrix(frame.Transform);

            // Curved text
            if (frame.Path != null)
            {
                // Get the first point of transformed path and move raw path to this point.
                var path = Path.FromAdvancedPath(frame.Raw.Path);
                if (!path.IsEmpty)
                {
                    path.Scale(72 / frame.DpiX, 72 / frame.DpiY);
                    path.Scale(transform.ScaleX, transform.ScaleY);

                    var transformedPath = Path.FromAdvancedPath(frame.Path);
                    transformedPath.Scale(72 / frame.DpiX, 72 / frame.DpiY);
                    var transformedFirstPoint = transformedPath.GetFirstPoint();

                    var firstPoint = path.GetFirstPoint();
                    path.Translate(transformedFirstPoint.X - firstPoint.X, transformedFirstPoint.Y - firstPoint.Y);
                }

                textVObject = new CurvedTextVObject { TextPath = path, FitToPath = true, Angle = transform.Angle, PathStart = frame.PathStartPoint, PathEnd = frame.PathEndPoint };
            }
            else if (Utils.EqualsOfFloatNumbers(frame.TextBox.Width, 0) && Utils.EqualsOfFloatNumbers(frame.TextBox.Height, 0))
            {
                var baselineLocation = new PointF(
                    Common.ConvertPixelsToPoints(frame.DpiX, frame.TextBox.X),
                    Common.ConvertPixelsToPoints(frame.DpiY, frame.TextBox.Y));

                textVObject = new PlainTextVObject { BaselineLocation = baselineLocation, Angle = transform.Angle, IsVertical = frame.IsVertical };
            }
            else
            {
                var textBoxShift = frame.IsVertical ? frame.Raw.TextBox.Width * (float)transform.ScaleX : 0;

                var rectangle = new RotatedRectangleF(new RectangleF(
                    Common.ConvertPixelsToPoints(frame.DpiX, frame.TextBox.X - textBoxShift),
                    Common.ConvertPixelsToPoints(frame.DpiY, frame.TextBox.Y),
                    Common.ConvertPixelsToPoints(frame.DpiX, frame.Raw.TextBox.Width * (float)transform.ScaleX),
                    Common.ConvertPixelsToPoints(frame.DpiY, frame.Raw.TextBox.Height * (float)transform.ScaleY)
                ));

                rectangle.RotateAt(transform.Angle, rectangle.Location);

                textVObject = new BoundedTextVObject { Rectangle = rectangle, IsVertical = frame.IsVertical };
            }

            var boundedText = textVObject as BoundedTextVObject;

            // Empty text is allowed in boundedTextVObject only
            if (boundedText == null && string.IsNullOrEmpty(frame.Text))
                return null;

            textVObject.Alignment = aligment;
            textVObject.Tracking = RoundFloat(frame.Tracking, 1);
            textVObject.Leading = RoundFloat(frame.Leading, 1);
            textVObject.VerticalScale = frame.VerticalScale * (float)transform.ScaleY;
            textVObject.HorizontalScale = frame.HorizontalScale * (float)transform.ScaleX;
            textVObject.TextColor = frame.Color;
            textVObject.Opacity = frame.Opacity;

            textVObject.Font.Size = RoundFloat(frame.Raw.FontSize, 2);
            textVObject.Font.PostScriptName = frame.FontName;

            if (textVObject is CurvedTextVObject)
                ((CurvedTextVObject)textVObject).OriginalFontSize = textVObject.Font.Size;

            var nonDefaultParagraphs = frame.Paragraphs.Count > 1 && frame.Paragraphs.Any(p => !Utils.EqualsOfFloatNumbers(0, p.FirstLineIndent) ||
                    !Utils.EqualsOfFloatNumbers(0, p.SpaceAfterParagraph) || !Utils.EqualsOfFloatNumbers(0, p.SpaceBeforeParagraph)) ||
                frame.Paragraphs.Count == 1 && frame.Paragraphs.First().FirstLineIndent > 0;

            if ((boundedText == null && !getRichTextForBoundedTextOnly && (forceRichText || frame.FormattedText.Count > 1)) ||
                (boundedText != null && (forceRichText || frame.FormattedText.Count > 1 || nonDefaultParagraphs)))
            {
                textVObject.Text = GetRichText(frame, textVObject);
                textVObject.IsRichText = true;
            }
            else
            {
                textVObject.Text = Common.XmlEscape(NormalizeString(frame.Text ?? "", frame.Caps));

                textVObject.Font.FauxBold = frame.FauxBold;
                textVObject.Font.FauxItalic = frame.FauxItalic;
                textVObject.Underline = frame.Underline;

                if (boundedText != null)
                {
                    boundedText.ParagraphSettings = new ParagraphSettings
                    {
                        FirstLineIndent = RoundFloat(frame.Paragraph.FirstLineIndent, 1),
                        SpaceAfter = RoundFloat(frame.Paragraph.SpaceAfterParagraph, 1),
                        SpaceBefore = RoundFloat(frame.Paragraph.SpaceBeforeParagraph, 1)
                    };
                }

                textVObject.IsRichText = false;
            }

            return textVObject;
        }

        private static float RoundFloat(float value, int digits)
        {
            return (float)System.Math.Round(value, digits);
        }

        private static VObject CreateShapeVObject(PsdShapeFrame frame)
        {
            if (frame.Width == 0 || frame.Height == 0)
                return null;

            var brush = frame.Brush as SolidBrush;
            var path = frame.VectorMask != null ? Path.FromAdvancedPath(frame.VectorMask) : null;
            if (path != null)
                path.Scale(72 / frame.DpiX, 72 / frame.DpiY);

            var shapeVObject = new ShapeVObject
            {
                Path = path,
                Opacity = frame.Opacity,
                BorderColor = frame.Pen != null ? frame.Pen.Color : ColorManagement.GetBlackColor(frame.ColorSpace),
                BorderWidth = frame.Pen != null ? frame.Pen.Width : 0,
                FillColor = brush != null ? brush.Color : ColorManagement.GetTransparentColor(frame.ColorSpace)
            };

            return shapeVObject;
        }

        private static VObject CreateImageVObject(PsdFrame frame)
        {
            if (frame.Width == 0 || frame.Height == 0)
                return null;

            var rect = new RectangleF(
                Common.ConvertPixelsToPoints(frame.DpiX, frame.X),
                Common.ConvertPixelsToPoints(frame.DpiY, frame.Y),
                Common.ConvertPixelsToPoints(frame.DpiX, frame.Width),
                Common.ConvertPixelsToPoints(frame.DpiY, frame.Height));

            var imageVObject = new ImageVObject { Opacity = frame.Opacity };
            imageVObject.ChangeControlPoints(rect.Left, rect.Top, rect.Right, rect.Bottom);

            return imageVObject;
        }

        private static string GetParagraphStyle(Codecs.Psd.ParagraphSettings paragraph)
        {
            var style = new StringBuilder();

            var firstLineIndent = RoundFloat(paragraph.FirstLineIndent, 1);
            if (!Utils.EqualsOfFloatNumbers(firstLineIndent, 0))
                style.AppendFormat("first-line-indent:{0}pt;", firstLineIndent.ToString(CultureInfo.InvariantCulture));

            var spaceAfter = RoundFloat(paragraph.SpaceAfterParagraph, 1);
            if (!Utils.EqualsOfFloatNumbers(spaceAfter, 0))
                style.AppendFormat("space-after:{0}pt;", spaceAfter.ToString(CultureInfo.InvariantCulture));

            var spaceBefore = RoundFloat(paragraph.SpaceBeforeParagraph, 1);
            if (!Utils.EqualsOfFloatNumbers(spaceBefore, 0))
                style.AppendFormat("space-before:{0}pt;", spaceBefore.ToString(CultureInfo.InvariantCulture));

            var leftMargin = RoundFloat(paragraph.LeftIndent, 1);
            if (!Utils.EqualsOfFloatNumbers(leftMargin, 0))
                style.AppendFormat("left-margin:{0}pt;", leftMargin.ToString(CultureInfo.InvariantCulture));

            var rightMargin = RoundFloat(paragraph.RightIndent, 1);
            if (!Utils.EqualsOfFloatNumbers(rightMargin, 0))
                style.AppendFormat("right-margin:{0}pt;", rightMargin.ToString(CultureInfo.InvariantCulture));

            return style.ToString().Trim();
        }

        private static string GetSpanStyle(ITextSettings span, BaseTextVObject text)
        {
            var style = new StringBuilder();

            if (span.FontName != text.Font.PostScriptName)
                style.AppendFormat("font-name:{0};", span.FontName);

            if (span.FauxBold)
                style.Append("bold:true;");

            if (span.FauxItalic)
                style.Append("italic:true;");

            if (span.Underline != text.Underline)
                style.AppendFormat("underline:{0};", span.Underline.ToString(CultureInfo.InvariantCulture).ToLower(CultureInfo.CurrentCulture));

            var spanColor = span.Color;
            if (span.Color != text.TextColor)
            {
                var colorString = ColorToFormatString(spanColor);
                if (!string.IsNullOrEmpty(colorString))
                    style.AppendFormat("color:{0};", colorString);
            }

            var fontSize = RoundFloat(span.FontSize / text.VerticalScale, 2);
            if (!Utils.EqualsOfFloatNumbers(fontSize, text.Font.Size))
                style.AppendFormat("font-size:{0}pt;", fontSize.ToString(CultureInfo.InvariantCulture));

            var tracking = RoundFloat(span.Tracking, 1);
            if (!Utils.EqualsOfFloatNumbers(tracking, text.Tracking))
                style.AppendFormat("tracking:{0};", tracking.ToString(CultureInfo.InvariantCulture));

            return style.ToString().Trim();
        }

        private static string GetRichText(PsdTextFrame textFrame, BaseTextVObject textVObject)
        {
            var paragraphs = textFrame.Paragraphs.ToList();

            var sb = new StringBuilder();

            var paragraphStyle = "";
            if (paragraphs.Count > 0)
            {
                paragraphStyle = GetParagraphStyle(paragraphs.First());
                paragraphs.RemoveAt(0);
            }

            if (string.IsNullOrEmpty(paragraphStyle))
                sb.Append("<p>");
            else
                sb.AppendFormat(@"<p style=""{0}"">", paragraphStyle);

            foreach (var span in textFrame.FormattedText)
            {
                var spanStyle = GetSpanStyle(span, textVObject);

                var paraTextList = span.String.Split('\r').ToList();

                var i = 0;
                foreach (var ptext in paraTextList)
                {
                    var isLast = ++i == paraTextList.Count;

                    var content = Common.XmlEscape(NormalizeString(!isLast && ptext == "" ? " " : ptext, span.Caps));

                    var lines = content.Split('\n');
                    foreach (var line in lines)
                    {
                        if (!string.IsNullOrEmpty(line))
                        {
                            if (!string.IsNullOrEmpty(spanStyle))
                                sb.AppendFormat(@"<span style=""{0}"">{1}</span>", spanStyle, line);
                            else
                                sb.AppendFormat(@"<span>{0}</span>", line);
                        }

                        if (line != lines.Last())
                            sb.Append("<br/>");
                    }

                    if (paragraphs.Count > 0 && !isLast)
                    {
                        paragraphStyle = GetParagraphStyle(paragraphs.First());
                        paragraphs.RemoveAt(0);

                        if (!string.IsNullOrEmpty(paragraphStyle))
                            sb.AppendFormat(@"</p><p style=""{0}"">", paragraphStyle);
                        else
                            sb.Append("</p><p>");
                    }
                }
            }

            sb.Append("</p>");

            return sb.ToString();
        }

        private static string ColorToFormatString(Color color)
        {
            var rgb = color as RgbColor;
            if (rgb != null)
                return string.Format(CultureInfo.CurrentCulture, "rgb({0}, {1}, {2}, {3})", rgb.R, rgb.G, rgb.B, rgb.A);

            var cmyk = color as CmykColor;
            if (cmyk != null)
                return string.Format(CultureInfo.CurrentCulture, "cmyk({0}, {1}, {2}, {3}, {4})", cmyk.C, cmyk.M, cmyk.Y, cmyk.K, cmyk.A);

            return null;
        }

        private static string NormalizeString(string str, FontCaps caps)
        {
            var result = str.Replace("\r", "\n").Replace("\u0003", "\n");
            if (caps == FontCaps.AllCap)
                result = result.ToUpper(CultureInfo.CurrentCulture);

            return result;
        }

        private static Transform GetTransformFromPsdMatrix(Matrix matrix)
        {
            var elements = matrix.Elements;
            var angle = System.Math.Atan(elements[1] / elements[0]);
            var cos = System.Math.Cos(angle);
            var sin = System.Math.Sin(angle);

            var scaleX = Utils.EqualsOfFloatNumbers(cos, 0) ? elements[1] / sin : elements[0] / cos;
            var scaleY = Utils.EqualsOfFloatNumbers(cos, 0) ? -elements[2] / sin : elements[3] / cos;

            return new Transform(scaleX, scaleY, elements[4], elements[5], Utils.ConvertRadianToDegree(angle));
        }
    }
}