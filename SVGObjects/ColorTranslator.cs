// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Drawing;
using System.Text;

namespace Aurigma.Svg
{
    public static class ColorTranslator
    {
        public static string ToSvg(Color color)
        {
            // Empty and full transparent color are not visible
            if (color.A == 0 || color.IsEmpty)
            {
                return "none";
            }

            var sb = new StringBuilder("#", 8);
            sb.Append(color.R.ToString("X2", null)).
                Append(color.G.ToString("X2", null)).
                Append(color.B.ToString("X2", null));
            return (sb.ToString().ToLowerInvariant());
        }

        public static Color FromSvg(string value)
        {
            if (value == "none")
            {
                return Color.Empty;
            }
            return System.Drawing.ColorTranslator.FromHtml(value);
        }
    }
}