// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.Svg;
using System.Xml;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class SvgVoImage : SvgVoContent, ISvgCompositeElement
    {
        private SvgImage _image = new SvgImage();

        public string Src { get; set; }

        #region ISvgCompositeElement Members

        public new void WriteContent(XmlElement xmlElement, SvgWriter svgWriter)
        {
            base.WriteContent(xmlElement, svgWriter);

            _image.X = X;
            _image.Y = Y;
            _image.Width = Width;
            _image.Height = Height;
            _image.Src = Src;
            _image.PreserveAspectRatio = "none";

            var xml = svgWriter.CreateXmlElementFromSvg(_image);
            xmlElement.AppendChild(xml);
            svgWriter.Write(_image, xml);
        }

        public new void ReadContent(XmlElement xmlElement, SvgReader svgReader)
        {
            base.ReadContent(xmlElement, svgReader);

            _image = null;
            foreach (var node in xmlElement.ChildNodes)
            {
                var childElement = node as XmlElement;
                if (childElement != null)
                {
                    var svgNode = svgReader.CreateSvgNodeFromXml(childElement);
                    svgReader.Read(svgNode, childElement);
                    if (svgNode is SvgImage)
                        _image = svgNode as SvgImage;
                }

                if (_image != null)
                    break;
            }

            if (_image != null)
            {
                Src = _image.Src;
                X = _image.X;
                Y = _image.Y;
                Width = _image.Width;
                Height = _image.Height;
            }
            else
                throw new SvgParseException(Resources.Exceptions.CanNotParseSvgVoImage);
        }

        #endregion ISvgCompositeElement Members
    }
}