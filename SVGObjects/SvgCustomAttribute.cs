using System;
using System.Collections.Generic;
using System.Text;

namespace Aurigma.Svg
{
	public class SvgCustomAttribute
	{
		public SvgCustomAttribute(string prefix, string localName, string value)
		{
			Prefix = prefix;
			LocalName = localName;
			Value = value;
		}

		public string Prefix { get; set; }

		public string LocalName { get; set; }

		public string Value { get; set; }
	}
}
