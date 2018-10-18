// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.Svg;
using System.Collections.Generic;
using System.Globalization;
using System.Xml;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class SvgVoGrid : SvgPath, ISvgCompositeElement
    {
        private readonly string _name = "g";
        private SvgPath _verticalPath = new SvgPath();
        private SvgPath _horizontalPath = new SvgPath();

        private string _verticalLineColor;
        private string _horizontalLineColor;

        public override string Name
        {
            get { return _name; }
        }

        public override string LocalName
        {
            get { return _name; }
        }

        private int _cols;

        public int Cols
        {
            get
            {
                return _cols;
            }
            set
            {
                if (_cols != value)
                {
                    _cols = value;
                    UpdatePath();
                }
            }
        }

        private int _rows;

        public int Rows
        {
            get
            {
                return _rows;
            }
            set
            {
                if (_rows != value)
                {
                    _rows = value;
                    UpdatePath();
                }
            }
        }

        private float _stepX;

        public float StepX
        {
            get
            {
                return _stepX;
            }
            set
            {
                if (_stepX != value)
                {
                    _stepX = value;
                    UpdatePath();
                }
            }
        }

        private float _stepY;

        public float StepY
        {
            get
            {
                return _stepY;
            }
            set
            {
                if (_stepY != value)
                {
                    _stepY = value;
                    UpdatePath();
                }
            }
        }

        private float _x;

        public float X
        {
            get
            {
                return _x;
            }
            set
            {
                if (_x != value)
                {
                    _x = value;
                    UpdatePath();
                }
            }
        }

        private float _y;

        public float Y
        {
            get
            {
                return _y;
            }
            set
            {
                if (_y != value)
                {
                    _y = value;
                    UpdatePath();
                }
            }
        }

        public System.Drawing.Color VerticalLineColor
        {
            get { return _verticalPath.Stroke; }
            set { _verticalPath.Stroke = value; }
        }

        public System.Drawing.Color HorizontalLineColor
        {
            get { return _horizontalPath.Stroke; }
            set { _horizontalPath.Stroke = value; }
        }

        public bool FixedStrokeWidth { get; set; }

        public override IEnumerable<SvgAttribute> GetAttributes()
        {
            var baseAttributes = base.GetAttributes();
            if (baseAttributes != null)
            {
                foreach (var attr in baseAttributes)
                {
                    // Skip path attributes
                    if (attr.NamespaceUri == XmlNamespace.Svg)
                    {
                        if (attr.LocalName == "stroke-width" || attr.LocalName == "stroke" || attr.LocalName == "stroke-opacity" ||
                            attr.LocalName == "fill" || attr.LocalName == "fill-opacity")
                            continue;
                    }

                    yield return attr;
                }
            }

            yield return new SvgAttribute("x", "0", XmlNamespace.AurigmaVectorObjects,
                () => X.ToString(CultureInfo.InvariantCulture),
                v => X = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("y", "0", XmlNamespace.AurigmaVectorObjects,
                () => Y.ToString(CultureInfo.InvariantCulture),
                v => Y = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("cols", "0", XmlNamespace.AurigmaVectorObjects,
                () => Cols.ToString(CultureInfo.InvariantCulture),
                v => Cols = SvgAttribute.ParseIntAttribute(v)
            );

            yield return new SvgAttribute("rows", "0", XmlNamespace.AurigmaVectorObjects,
                () => Rows.ToString(CultureInfo.InvariantCulture),
                v => Rows = SvgAttribute.ParseIntAttribute(v)
            );

            yield return new SvgAttribute("step-x", "0", XmlNamespace.AurigmaVectorObjects,
                () => StepX.ToString(CultureInfo.InvariantCulture),
                v => StepX = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("step-y", "0", XmlNamespace.AurigmaVectorObjects,
                () => StepY.ToString(CultureInfo.InvariantCulture),
                v => StepY = SvgAttribute.ParseFloatAttribute(v)
            );

            yield return new SvgAttribute("stroke-fixed-width", "", XmlNamespace.AurigmaVectorObjects,
                () => FixedStrokeWidth.ToString(CultureInfo.InvariantCulture).ToLowerInvariant(),
                v => FixedStrokeWidth = v != "false"
            );

            yield return new SvgAttribute("vertical-line-color", "", XmlNamespace.AurigmaVectorObjects,
               () => _verticalLineColor,
               v => _verticalLineColor = v
           );

            yield return new SvgAttribute("horizontal-line-color", "", XmlNamespace.AurigmaVectorObjects,
                () => _horizontalLineColor,
                v => _horizontalLineColor = v
            );
        }

        internal void SetVerticalLineColor(Color color, RgbColor preview, JsonVOSerializer serializer)
        {
            VerticalLineColor = preview;
            _verticalLineColor = serializer.Serialize(color);
        }

        internal Color GetVerticalLineColor(JsonVOSerializer serializer)
        {
            return !string.IsNullOrEmpty(_verticalLineColor) ? serializer.Deserialize<Color>(_verticalLineColor) : new RgbColor(VerticalLineColor);
        }

        internal void SetHorizontalLineColor(Color color, RgbColor preview, JsonVOSerializer serializer)
        {
            HorizontalLineColor = preview;
            _horizontalLineColor = serializer.Serialize(color);
        }

        internal Color GetHorizontalLineColor(JsonVOSerializer serializer)
        {
            return !string.IsNullOrEmpty(_horizontalLineColor) ? serializer.Deserialize<Color>(_horizontalLineColor) : new RgbColor(HorizontalLineColor);
        }

        #region ISvgCompositeElement Members

        public void WriteContent(XmlElement xmlElement, SvgWriter svgWriter)
        {
            _verticalPath.StrokeWidth = StrokeWidth;
            _verticalPath.ID = ID + "_vertical";
            _horizontalPath.StrokeWidth = StrokeWidth;
            _horizontalPath.ID = ID + "_horizontal";

            var xml = svgWriter.CreateXmlElementFromSvg(_verticalPath);
            xmlElement.AppendChild(xml);
            svgWriter.Write(_verticalPath, xml);

            xml = svgWriter.CreateXmlElementFromSvg(_horizontalPath);
            xmlElement.AppendChild(xml);
            svgWriter.Write(_horizontalPath, xml);
        }

        public void ReadContent(XmlElement xmlElement, SvgReader svgReader)
        {
            _verticalPath = null;
            _horizontalPath = null;
            foreach (var node in xmlElement.ChildNodes)
            {
                var childElement = node as XmlElement;
                if (childElement != null)
                {
                    var svgNode = svgReader.CreateSvgNodeFromXml(childElement);
                    svgReader.Read(svgNode, childElement);
                    if (svgNode is SvgPath)
                    {
                        var path = svgNode as SvgPath;
                        if (path.ID.Contains("_vertical"))
                            _verticalPath = path;
                        else if (path.ID.Contains("_horizontal"))
                            _horizontalPath = path;
                    }
                }

                if (_verticalPath != null && _horizontalPath != null)
                    break;
            }

            if (_verticalPath != null && _horizontalPath != null)
            {
                StrokeWidth = _verticalPath.StrokeWidth;
            }
            else
                throw new SvgParseException(Resources.Exceptions.CanNotParseSvgVoContent);
        }

        #endregion ISvgCompositeElement Members

        private void UpdatePath()
        {
            _verticalPath.Path.Clear();
            _horizontalPath.Path.Clear();
            if (Rows <= 0 || Cols <= 0 || StepX <= 0 || StepY <= 0)
                return;

            var w = Cols * StepX;
            var h = Rows * StepY;

            // Vertical lines
            for (int i = 0; i <= Cols; i++)
            {
                float x = X + i * StepX + StrokeWidth / 2;
                float y1 = Y;
                float y2 = Y + h + StrokeWidth;
                _verticalPath.Path.Add(new PathCommand("M", new List<float>() { x, y1 }));
                _verticalPath.Path.Add(new PathCommand("L", new List<float>() { x, y2 }));
            }

            // Horizontal lines
            for (int i = 0; i <= Rows; i++)
            {
                float x1 = X;
                float x2 = X + w + StrokeWidth;
                float y = Y + i * StepY + StrokeWidth / 2;
                _horizontalPath.Path.Add(new PathCommand("M", new List<float>() { x1, y }));
                _horizontalPath.Path.Add(new PathCommand("L", new List<float>() { x2, y }));
            }
        }
    }
}