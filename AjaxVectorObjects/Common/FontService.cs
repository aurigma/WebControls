// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;
using System.Linq;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class FontService
    {
        private readonly Configuration _configuration = (Configuration)Configuration.Instance;

        public Dictionary<string, IList<Configuration.FontData>> GetAllFontsDataByFamily()
        {
            lock (_configuration.LocalFonts)
                return new[] { _configuration.SystemFonts, _configuration.LocalFonts }
                    .SelectMany(d => d)
                    .ToLookup(pair => pair.Key, pair => pair.Value, StringComparer.InvariantCultureIgnoreCase)
                    .ToDictionary(grouping => grouping.Key, grouping => grouping.SelectMany(l => l).ToList() as IList<Configuration.FontData>);
        }

        public Dictionary<string, Configuration.FontData> GetAllFontsDataByPsName()
        {
            lock (_configuration.LocalFonts)
                return
                    _configuration.SystemFonts.Concat(_configuration.LocalFonts)
                        .SelectMany(p => p.Value)
                        .ToLookup(d => d.PostScriptName, d => d, StringComparer.InvariantCultureIgnoreCase)
                        .ToDictionary(grouping => grouping.Key, grouping => grouping.FirstOrDefault(d => !d.System) ?? grouping.First());
        }

        public FontStyle RecognizeFontStyle(string style)
        {
            style = style.ToLowerInvariant();

            var styleLiterals = new
            {
                bold = "bold",
                italic = "italic",
                regular = "regular",
                boldItalic = new[] { "bold italic", "italic bold", "bolditalic", "italicbold" }
            };

            style = style.ToLowerInvariant();

            if (style == styleLiterals.bold)
                return FontStyle.Bold;

            if (style == styleLiterals.italic)
                return FontStyle.Italic;

            if (style == styleLiterals.regular)
                return FontStyle.Regular;

            return styleLiterals.boldItalic.Contains(style) ? FontStyle.BoldItalic : FontStyle.Other;
        }

        public string FindSuitablePostscriptName(string familyName, bool requireBold, bool requireItalic, out bool fauxBold, out bool fauxItalic)
        {
            var avalibleFontsByFamily = GetAllFontsDataByFamily();

            if (!avalibleFontsByFamily.ContainsKey(familyName))
                throw new ArgumentException(string.Format("Unknown font family: {0}", familyName));

            var availStyles = avalibleFontsByFamily[familyName].Select(fd => new
            {
                Style = RecognizeFontStyle(fd.Style),
                StyleStr = fd.Style,
                fd.PostScriptName
            })
                .ToArray();

            FontStyle requestedStyle;
            if (requireBold && requireItalic)
                requestedStyle = FontStyle.BoldItalic;
            else if (requireBold)
                requestedStyle = FontStyle.Bold;
            else if (requireItalic)
                requestedStyle = FontStyle.Italic;
            else
                requestedStyle = FontStyle.Regular;

            var requireStyleData = availStyles.FirstOrDefault(d => d.Style == requestedStyle);

            if (requireStyleData != null)
            {
                fauxBold = false;
                fauxItalic = false;
                return requireStyleData.PostScriptName;
            }

            if (requestedStyle == FontStyle.BoldItalic)
            {
                var boldStyleData = availStyles.FirstOrDefault(d => d.Style == FontStyle.Bold);
                if (boldStyleData != null)
                {
                    fauxBold = false;
                    fauxItalic = true;
                    return boldStyleData.PostScriptName;
                }

                var italicStyleData = availStyles.FirstOrDefault(d => d.Style == FontStyle.Italic);
                if (italicStyleData != null)
                {
                    fauxBold = true;
                    fauxItalic = false;
                    return italicStyleData.PostScriptName;
                }
            }

            fauxBold = requireBold;
            fauxItalic = requireItalic;
            var regularStyleData = availStyles.FirstOrDefault(d => d.Style == FontStyle.Regular);

            return regularStyleData != null ? regularStyleData.PostScriptName : availStyles.First().PostScriptName;
        }

        public static FontSettings FindSuitableFont(string fontFamily, bool requestedBold = false, bool requestedItalic = false, string requestedStyle = null)
        {
            var fontService = new FontService();
            var allFontsDataByFamily = fontService.GetAllFontsDataByFamily();
            var allFontsByPsName = fontService.GetAllFontsDataByPsName();

            string postScriptName = null;
            var fauxBold = false;
            var fauxItalic = false;
            if (!allFontsDataByFamily.ContainsKey(fontFamily))
            {
                if (allFontsByPsName.ContainsKey(fontFamily))
                {
                    postScriptName = fontFamily;
                    fauxBold = requestedBold;
                    fauxItalic = requestedItalic;
                }
                else
                {
                    Configuration.Logger.Warning(string.Format("Unknown font {0}", fontFamily));
                    fontFamily = "Arial";
                }
            }

            if (postScriptName == null)
            {
                var avalibleStyles = allFontsDataByFamily[fontFamily];

                postScriptName = fontService.FindSuitablePostscriptName(fontFamily, requestedBold, requestedItalic, out fauxBold, out fauxItalic);

                if (requestedStyle != null &&
                    avalibleStyles.FirstOrDefault(
                        fd => fd.Style.Equals(requestedStyle, StringComparison.InvariantCultureIgnoreCase)) != null)
                {
                    postScriptName = avalibleStyles.First(
                        fd => fd.Style.Equals(requestedStyle, StringComparison.InvariantCultureIgnoreCase))
                        .PostScriptName;
                }
            }

            return new FontSettings
            {
                PostScriptName = postScriptName,
                FauxBold = fauxBold,
                FauxItalic = fauxItalic
            };
        }

        public enum FontStyle
        {
            Bold, Italic, Regular, BoldItalic, Other
        }
    }
}