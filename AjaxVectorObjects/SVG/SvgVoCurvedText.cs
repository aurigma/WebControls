// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using Aurigma.Svg;
using System.Collections.Generic;
using System.Globalization;
using System.Xml;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class SvgVoCurvedText : SvgVoText, ISvgCompositeElement
    {
        public Path Path { get; set; }
        public bool FitToPath { get; set; }
        public bool Stretch { get; set; }
        public float OriginalFontSize { get; set; }
        public float FitToPathStep { get; set; }
        public float PathStart { get; set; }
        public float PathEnd { get; set; }

        public SvgVoCurvedText()
        {
            PathEnd = 1f;
        }

        public override IEnumerable<SvgAttribute> GetAttributes()
        {
            var baseAttributes = base.GetAttributes();
            if (baseAttributes != null)
            {
                foreach (var attr in baseAttributes)
                {
                    yield return attr;
                }
            }

            var ci = CultureInfo.InvariantCulture;
            yield return new SvgAttribute("fit-to-path", null,
                XmlNamespace.AurigmaVectorObjects,
                () => FitToPath.ToString(ci),
                v => FitToPath = SvgAttribute.ParseBooleanAttribute(v)
            );

            yield return new SvgAttribute("stretch", null,
               XmlNamespace.AurigmaVectorObjects,
               () => Stretch.ToString(ci),
               v => Stretch = SvgAttribute.ParseBooleanAttribute(v)
           );

            yield return new SvgAttribute("original-font-size", "0",
                XmlNamespace.AurigmaVectorObjects,
                () => OriginalFontSize.ToString(ci),
                v => OriginalFontSize = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("fit-to-path-step", "1",
               XmlNamespace.AurigmaVectorObjects,
               () => FitToPathStep.ToString(ci),
               v => FitToPathStep = SvgAttribute.ParseFloatAttribute(v)
           );

            yield return new SvgAttribute("path-start", "0",
               XmlNamespace.AurigmaVectorObjects,
               () => PathStart.ToString(ci),
               v => PathStart = SvgAttribute.ParseFloatAttribute(v)
            );
            yield return new SvgAttribute("path-end", "1",
               XmlNamespace.AurigmaVectorObjects,
               () => PathEnd.ToString(ci),
               v => PathEnd = SvgAttribute.ParseFloatAttribute(v)
            );
        }

        protected override void WriteText(SvgText text)
        {
            base.WriteText(text);

            text.X = 0;
            text.Y = 0;
            text.Transform = null;
        }

        #region ISvgCompositeElement Members

        public new void WriteContent(XmlElement xmlElement, SvgWriter svgWriter)
        {
            base.WriteContent(xmlElement, svgWriter);

            // To serialize CurvedText we need to insert path def and textPath tags inside text tag (the last element)
            if (xmlElement.LastChild != null && xmlElement.LastChild.Name == "text")
            {
                var textElement = xmlElement.LastChild as XmlElement;
                textElement.InnerText = "";

                var defsElement = svgWriter.CreateXmlElementFromSvg(new SvgDefs());

                var path = Path.ToSvgPath();
                path.ID = "path_" + ID;

                var xml = svgWriter.CreateXmlElementFromSvg(path);
                defsElement.AppendChild(xml);
                svgWriter.Write(path, xml);

                textElement.AppendChild(defsElement);

                var textPathElement = textElement.OwnerDocument.CreateElement("textPath", XmlNamespace.Svg);
                textPathElement.SetAttribute("href", XmlNamespace.Xlink, "#" + path.ID);
                textPathElement.InnerText = Text;

                textElement.AppendChild(textPathElement);
            }
        }

        public new void ReadContent(XmlElement xmlElement, SvgReader svgReader)
        {
            base.ReadContent(xmlElement, svgReader);

            // To deserialize CurvedText we need to read path def from text tag (the last element)
            if (xmlElement.LastChild != null && xmlElement.LastChild.Name == "text")
            {
                xmlElement = xmlElement.LastChild as XmlElement;

                foreach (var node in xmlElement.ChildNodes)
                {
                    var childElement = node as XmlElement;
                    if (childElement != null)
                    {
                        var svgNode = svgReader.CreateSvgNodeFromXml(childElement);
                        svgReader.Read(svgNode, childElement);

                        if (svgNode is SvgDefs)
                        {
                            childElement = childElement.FirstChild as XmlElement;
                            svgNode = svgReader.CreateSvgNodeFromXml(childElement);
                            svgReader.Read(svgNode, childElement);

                            if (svgNode is SvgPath)
                            {
                                Path = Path.FromSvgPath(svgNode as SvgPath);
                                break;
                            }
                        }
                    }
                }
            }

            if (Path == null || Path.IsEmpty)
                throw new SvgParseException(Resources.Exceptions.CanNotParseSvgVoCurvedText);
        }

        #endregion ISvgCompositeElement Members
    }
}