// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.Svg;
using System;
using System.Collections.Generic;
using System.Xml;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class SvgVoPlaceholder : SvgVoShape, ISvgCompositeElement
    {
        private readonly string _name = "g";
        private SvgPath _background = new SvgPath();
        private SvgPath _border = new SvgPath();

        public override string Name
        {
            get { return _name; }
        }

        public override string LocalName
        {
            get { return _name; }
        }

        public SvgVoContent Content { get; set; }

        public bool ShowMaskedContent { get; set; }

        public bool IsStubContent { get; set; }

        public override IEnumerable<SvgAttribute> GetAttributes()
        {
            var baseAttributes = base.GetAttributes();
            if (baseAttributes != null)
            {
                foreach (var attr in baseAttributes)
                {
                    // Skip rect attributes
                    if (attr.NamespaceUri == XmlNamespace.Svg)
                    {
                        if (attr.LocalName == "path" || attr.LocalName == "stroke-width" || attr.LocalName == "stroke" || attr.LocalName == "stroke-opacity" ||
                            attr.LocalName == "fill" || attr.LocalName == "fill-opacity")
                            continue;
                    }

                    yield return attr;
                }
            }

            yield return new SvgAttribute("showMaskedContent", "true", XmlNamespace.AurigmaVectorObjects,
                () => ShowMaskedContent.ToString(),
                v => ShowMaskedContent = SvgAttribute.ParseBooleanAttribute(v, true)
            );

            yield return new SvgAttribute("isStub", "false", XmlNamespace.AurigmaVectorObjects,
                () => IsStubContent.ToString(),
                v => IsStubContent = SvgAttribute.ParseBooleanAttribute(v, true)
            );
        }

        #region ISvgCompositeElement Members

        public void WriteContent(XmlElement xmlElement, SvgWriter svgWriter)
        {
            _background.ID = ID + "_background";
            _background.Path = Path;
            _background.Fill = Fill;

            _border.ID = ID + "_border";
            _border.Path = Path;
            _border.Stroke = Stroke;
            _border.StrokeWidth = StrokeWidth;
            _border.Fill = System.Drawing.Color.Transparent;

            if (Content != null)
            {
                var doc = xmlElement.OwnerDocument;
                var clipPath = doc.CreateElement("clipPath", XmlNamespace.Svg);
                var id = "clip" + Guid.NewGuid().ToString("N");
                clipPath.SetAttribute("id", id);
                xmlElement.AppendChild(clipPath);

                clipPath = doc.CreateElement("path", XmlNamespace.Svg);
                xmlElement.LastChild.AppendChild(clipPath);
                clipPath.SetAttribute("d", PathCommand.ToSvgString(Path));

                xmlElement.SetAttribute("clip-path", string.Format("url(#{0})", id));
            }

            var xml = svgWriter.CreateXmlElementFromSvg(_background);
            xmlElement.AppendChild(xml);
            svgWriter.Write(_background, xml);

            if (Content != null)
            {
                xml = svgWriter.CreateXmlElementFromSvg(Content);
                xmlElement.AppendChild(xml);
                svgWriter.Write(Content, xml);
            }

            xml = svgWriter.CreateXmlElementFromSvg(_border);
            xmlElement.AppendChild(xml);
            svgWriter.Write(_border, xml);
        }

        public void ReadContent(XmlElement xmlElement, SvgReader svgReader)
        {
            _background = null;
            _border = null;
            foreach (var node in xmlElement.ChildNodes)
            {
                var childElement = node as XmlElement;
                if (childElement != null && childElement.Name != "clipPath")
                {
                    var svgNode = svgReader.CreateSvgNodeFromXml(childElement);
                    svgReader.Read(svgNode, childElement);
                    if (svgNode is SvgVoContent)
                    {
                        Content = svgNode as SvgVoContent;
                    }
                    else if (svgNode is SvgPath)
                    {
                        var path = svgNode as SvgPath;
                        if (path.ID.Contains("_background"))
                            _background = path;
                        else if (path.ID.Contains("_border"))
                            _border = path;
                    }
                    else if (svgNode is SvgRect)
                    {
                        var rect = svgNode as SvgRect;
                        if (rect.ID.Contains("_background"))
                            _background = RectToPath(rect);
                        else if (rect.ID.Contains("_border"))
                            _border = RectToPath(rect);
                    }
                }

                if (_background != null && _border != null && Content != null)
                    break;
            }

            if (_background != null && _border != null)
            {
                Path = _border.Path;
                Fill = _background.Fill;
                Stroke = _border.Stroke;
                StrokeWidth = _border.StrokeWidth;
            }
            else
                throw new SvgParseException(Resources.Exceptions.CanNotParseSvgVoPlaceholder);
        }

        #endregion ISvgCompositeElement Members

        private static SvgPath RectToPath(SvgRect rect)
        {
            return new SvgPath
            {
                Fill = rect.Fill,
                Stroke = rect.Stroke,
                StrokeWidth = rect.StrokeWidth,
                Path = Math.Path.CreateRectanglePath(rect.X, rect.Y, rect.Width, rect.Height).ToPathCommands()
            };
        }
    }
}