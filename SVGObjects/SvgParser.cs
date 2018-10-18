using System;
using System.Collections.Generic;
using System.Text;
using System.Xml;
using System.Globalization;
using System.Drawing.Drawing2D;
using System.Text.RegularExpressions;

namespace Aurigma.Svg
{
	internal class SvgParser
	{
		public virtual void Parse(SvgDocument svgDocument, XmlReader xmlReader)
		{
			var xmlDoc = new XmlDocument();
			try
			{
				xmlDoc.Load(xmlReader);
			}
			catch (XmlException ex)
			{
				throw new SvgParseException(Messages.CanNotLoadSvg, ex);
			}

			var xmlRoot = xmlDoc.DocumentElement;
			if (xmlRoot.LocalName != svgDocument.LocalName)
			{
				throw new SvgParseException(Messages.IncorrectRootElement);
			}

			var attributes = xmlRoot.Attributes;
			svgDocument.ID = GetStringAttribute(attributes, "id");
			svgDocument.Height = GetFloatAttribute(attributes, "height");
			svgDocument.Width = GetFloatAttribute(attributes, "width");

			ParseChildNodes(svgDocument, xmlRoot.ChildNodes);
		}

		private void ParseChildNodes(SvgNode svgNode, XmlNodeList xmlNodeList)
		{
			foreach (XmlElement xmlNode in xmlNodeList)
			{
				SvgNode childNode = null;
				switch (xmlNode.LocalName)
				{
					case "defs":
						childNode = ParseDefsElement(xmlNode);
						break;
					case "g":
						childNode = ParseGroupElement(xmlNode);
						break;
					case "image":
						childNode = ParseImageElement(xmlNode);
						break;
					case "line":
						childNode = ParseLineElement(xmlNode);
						break;
					default:
						childNode = ParseUnknownElement(xmlNode);
						break;
				}

				if (childNode != null)
				{
					svgNode.ChildNodes.Add(childNode);
				}
			}
		}

		public virtual SvgNode ParseUnknownElement(XmlElement xmlNode)
		{
			throw new NotImplementedException();
		}

		public virtual SvgLine ParseLineElement(XmlElement xmlNode)
		{
			throw new NotImplementedException();
		}

		public virtual SvgImage ParseImageElement(XmlElement xmlNode)
		{
			throw new NotImplementedException();
		}

		public virtual SvgGroup ParseGroupElement(XmlElement xmlNode)
		{
			throw new NotImplementedException();
		}

		public virtual SvgDefs ParseDefsElement(XmlElement xmlNode)
		{
			SvgDefs svgDefs = new SvgDefs();
			FillElementProperties(svgDefs, xmlNode);
			return svgDefs;
		}

		private void FillElementProperties(SvgElement svgElement, XmlElement xmlNode)
		{
			var attributes = xmlNode.Attributes;
			svgElement.ID = GetStringAttribute(attributes, "id");
			svgElement.Display = GetDisplayAttribute(attributes);
			svgElement.Transform = GetTransformAttribute(attributes);

			//foreach (XmlAttribute attr in attributes)
			//{
			//    if (!string.IsNullOrEmpty(attr.Prefix) && svgDocument.ContainsCustomPrefix(attr.Prefix))
			//    {
			//        svgDocument.C
			//    }
			//}
		}

		public virtual Matrix GetTransformAttribute(XmlAttributeCollection attributes,
			string name = "transform", Matrix defaultValue = null)
		{
			var s = GetStringAttribute(attributes, name);
			if (string.IsNullOrEmpty(s))
			{
				return defaultValue;
			}
			var rg = new Regex(string.Format(@"matrix\s*\({0},{0},{0},{0},{0},{0}\)", @"\s*([0-9\-+.eE]+)\s*"),
				RegexOptions.CultureInvariant | RegexOptions.Compiled);
			var match = rg.Match(s);
			if (match == null || !match.Success)
			{
				return defaultValue;
			}
			float[] m = new float[6];
			int i = 0;
			for (i = 1; i < 7; i++)
			{
				if (!float.TryParse(match.Groups[i].Value, NumberStyles.Float, CultureInfo.InvariantCulture, out m[i - 1]))
				{
					break;
				}
			}

			if (i < 7)
			{
				return defaultValue;
			}

			return new Matrix(m[0], m[1], m[2], m[3], m[4], m[5]);
		}

		private Display GetDisplayAttribute(XmlAttributeCollection attributes,
			string name = "display", Display defaultValue = Display.Inline)
		{
			var s = GetStringAttribute(attributes, name);
			if (string.IsNullOrEmpty(s))
			{
				return defaultValue;
			}
			try
			{
				var value = (Display)Enum.Parse(typeof(Display), s, true);
				if (Enum.IsDefined(typeof(Display), value))
				{
					return value;
				}
			}
			catch
			{
			}
			return defaultValue;
		}

		private float GetFloatAttribute(XmlAttributeCollection attributeCollection, string name, float defaultValue = 0)
		{
			float val;
			var s = GetStringAttribute(attributeCollection, name);
			if (!string.IsNullOrEmpty(s) && float.TryParse(s, NumberStyles.Float,
				CultureInfo.InvariantCulture, out val))
			{
				return val;
			}
			return defaultValue;
		}

		private string GetStringAttribute(XmlAttributeCollection attributeCollection, string name, string defaultValue = "")
		{
			var attr = attributeCollection[name];
			if (attr != null && attr.Value != null)
			{
				return attr.Value;
			}
			return defaultValue;
		}
	}
}
