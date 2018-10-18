// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Globalization;
using System.Text.RegularExpressions;

namespace Aurigma.Svg
{
    public class SvgAttribute
    {
        private static readonly Regex transformRegex = new Regex(string.Format(
            @"matrix\s*\({0},{0},{0},{0},{0},{0}\)", @"\s*([0-9\-+.eE]+)\s*"),
            RegexOptions.CultureInvariant | RegexOptions.Compiled);

        private readonly Action<string> _setter;
        private Func<string> _getter;

        public SvgAttribute(string name, Func<string> getter, Action<string> setter)
            : this(name, null, null, getter, setter)
        {
        }

        public SvgAttribute(string name, string defaultValue, Func<string> getter, Action<string> setter)
            : this(name, defaultValue, null, getter, setter)
        {
        }

        public SvgAttribute(string name, string defaultValue, string namespaceUri, Func<string> getter, Action<string> setter)
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new ArgumentNullException("name");
            }

            LocalName = name;

            if (string.IsNullOrEmpty(namespaceUri))
            {
                // Default namespace http://www.w3.org/2000/svg
                NamespaceUri = XmlNamespace.Svg;
            }
            else
            {
                NamespaceUri = namespaceUri;
            }

            DefaultValue = defaultValue ?? "";

            _getter = getter;
            _setter = setter;
        }

        public string DefaultValue { get; private set; }

        public string NamespaceUri { get; private set; }

        public string LocalName { get; private set; }

        public virtual string GetValue()
        {
            if (_getter != null)
            {
                return _getter();
            }
            return null;
        }

        public virtual void SetValue(string value)
        {
            if (_setter != null)
            {
                _setter(value);
            }
        }

        public static float ParseFloatAttribute(string value, float defaultValue = 0)
        {
            float val;
            if (!string.IsNullOrEmpty(value) && float.TryParse(value, NumberStyles.Float,
                CultureInfo.InvariantCulture, out val))
            {
                return val;
            }
            return defaultValue;
        }

        public static Display ParseDisplayAttribute(string value, Display defaultValue = Display.Inline)
        {
            try
            {
                var d = (Display)Enum.Parse(typeof(Display), value, true);
                if (Enum.IsDefined(typeof(Display), d))
                {
                    return d;
                }
            }
            catch
            {
                // Ignore exception and return default value
            }
            return defaultValue;
        }

        public static Matrix ParseTransformAttribute(string value, Matrix defaultValue = null)
        {
            if (string.IsNullOrEmpty(value))
            {
                return defaultValue;
            }
            var match = transformRegex.Match(value);
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

            // Can not parse all values
            if (i < 7)
            {
                return defaultValue;
            }

            return new Matrix(m[0], m[1], m[2], m[3], m[4], m[5]);
        }

        public static RectangleF ParseViewBoxAttribute(string value, RectangleF defaultValue = default(RectangleF))
        {
            if (string.IsNullOrEmpty(value))
            {
                return defaultValue;
            }
            var values = value.Split(',');
            if (values.Length != 4)
            {
                return defaultValue;
            }

            float[] fvalues = new float[4];
            int i;
            for (i = 0; i < 4; i++)
            {
                if (string.IsNullOrEmpty(values[i]) ||
                    !float.TryParse(values[i], NumberStyles.Float, CultureInfo.InvariantCulture, out fvalues[i]))
                {
                    break;
                }
            }

            // Can not parse all values
            if (i < 4)
            {
                return defaultValue;
            }

            return new RectangleF(fvalues[0], fvalues[1], fvalues[2], fvalues[3]);
        }

        public static Color ParseColorAttribute(string value, int alpha, Color defaultvalue = default(Color))
        {
            if (alpha < 0 || alpha > 255)
            {
                throw new ArgumentOutOfRangeException("alpha", alpha, null);
            }

            if (string.IsNullOrEmpty(value))
            {
                return defaultvalue;
            }

            if (value == "none")
            {
                return ColorTranslator.FromSvg(value);
            }

            try
            {
                return Color.FromArgb(alpha, ColorTranslator.FromSvg(value));
            }
            catch
            {
                return defaultvalue;
            }
        }

        public static bool ParseBooleanAttribute(string value, bool defaultValue = false)
        {
            bool b;
            if (bool.TryParse(value, out b))
            {
                return b;
            }

            return defaultValue;
        }

        public static T ParseEnumAttribute<T>(string value, T defaultValue = default(T))
            where T : struct, IComparable, IFormattable // Enum expected
        {
            if (!typeof(T).IsEnum)
            {
                throw new ArgumentException("T must be an enumerated type");
            }

            try
            {
                return (T)Enum.Parse(typeof(T), value, true);
            }
            catch
            {
                return defaultValue;
            }
        }

        public static Color ParseOpacityAttribute(string value, Color baseColor, int defaultValue = 255)
        {
            double d;
            if (string.IsNullOrEmpty(value) || !double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out d))
            {
                return Color.FromArgb(defaultValue, baseColor);
            }

            if (d < 0 || d > 1)
            {
                throw new ArgumentOutOfRangeException("value", d, null);
            }

            int alpha = (int)Math.Round(d * 255);
            return Color.FromArgb(alpha, baseColor);
        }

        internal static List<PointF> ParsePointsDataAttribute(string value, List<PointF> defaultValue = null)
        {
            if (string.IsNullOrEmpty(value))
            {
                return defaultValue;
            }

            var ci = CultureInfo.InvariantCulture;
            var pairs = value.Split(' ');
            var list = new List<PointF>(pairs.Length);
            foreach (var pair in pairs)
            {
                var pp = pair.Split(',');
                if (pp.Length != 2)
                {
                    return defaultValue;
                }

                float x, y;
                if (float.TryParse(pp[0], NumberStyles.Float, ci, out x) &&
                    float.TryParse(pp[1], NumberStyles.Float, ci, out y))
                {
                    list.Add(new PointF(x, y));
                }
                else
                {
                    return defaultValue;
                }
            }

            return list;
        }

        public static List<float> ParseFloatArray(string value, List<float> defaultValue = null)
        {
            if (string.IsNullOrEmpty(value))
            {
                return defaultValue;
            }

            var ci = CultureInfo.InvariantCulture;
            var strValues = value.Split(' ');
            var list = new List<float>(strValues.Length);
            foreach (var v in strValues)
            {
                float f;
                if (float.TryParse(v, NumberStyles.Float, ci, out f))
                {
                    list.Add(f);
                }
                else
                {
                    return defaultValue;
                }
            }

            return list;
        }

        public static int ParseIntAttribute(string value, int defaultValue = 0)
        {
            int val;
            if (!string.IsNullOrEmpty(value) && int.TryParse(value, NumberStyles.Integer,
                CultureInfo.InvariantCulture, out val))
            {
                return val;
            }
            return defaultValue;
        }
    }
}