// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.IO;

namespace Aurigma.GraphicsMill.AjaxControls
{
    public static class Common
    {
        internal static int ConvertPointsToPixels(float dpi, float points)
        {
            return UnitConverter.ConvertUnitsToPixels(dpi, points, Unit.Point);
        }

        internal static float ConvertPixelsToPoints(float dpi, int pixels)
        {
            return UnitConverter.ConvertPixelsToUnits(dpi, pixels, Unit.Point);
        }

        internal static void RegisterResourcesScripts(System.Web.UI.Page page)
        {
            if (!page.ClientScript.IsStartupScriptRegistered("GraphicsMill_Resources"))
            {
                string script = "\r\nAurigma.GraphicsMill.Resources = {";

                var resources = new[]
                {
                    "spacer$gif", "Pan$cur", "Select$cur", "ZoomRectangle$cur", "ZoomIn$cur", "ZoomOut$cur"
                };

                foreach (var resource in resources)
                {
                    script += resource + ":\"" + page.ClientScript.GetWebResourceUrl(typeof(Common),
                        "Aurigma.GraphicsMill.AjaxControls.Resources." + resource.Replace('$', '.')) + "\",";
                }

                script += "getUrl:function(n){return this[n.split(\".\").join(\"$\")];}};\r\n";

                page.ClientScript.RegisterStartupScript(typeof(Common), "GraphicsMill_Resources", script, true);
            }
        }

        internal static System.Globalization.NumberFormatInfo GetNumberFormat()
        {
            System.Globalization.NumberFormatInfo format = new System.Globalization.NumberFormatInfo();
            format.CurrencyDecimalSeparator = ".";
            return format;
        }

        public static string CalculateMD5(Stream stream)
        {
            var position = stream.CanSeek ? stream.Position : -1;

            using (var md5 = System.Security.Cryptography.MD5.Create())
            {
                var hash = md5.ComputeHash(stream);

                if (stream.CanSeek && position >= 0)
                    stream.Position = position;

                return new string(ByteToChar(hash));
            }
        }

        public static string CalculateMD5(FileInfo file)
        {
            using (var fs = file.OpenRead())
            {
                return CalculateMD5(fs);
            }
        }

        public static string CalculateMD5(byte[] data)
        {
            using (var md5 = System.Security.Cryptography.MD5.Create())
            {
                var hash = md5.ComputeHash(data);
                return new string(ByteToChar(hash));
            }
        }

        /// <summary>
        /// Convert byte array to char array, e.g. { 0x12, 0x56, 0xEF } to { '1', '2', '5', '6', 'E', 'F' }.
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        private static char[] ByteToChar(byte[] bytes)
        {
            char[] c = new char[bytes.Length * 2];
            byte b;
            for (int i = 0; i < bytes.Length; i++)
            {
                b = ((byte)(bytes[i] >> 4));
                c[i * 2] = (char)(b > 9 ? b + 0x37 : b + 0x30);
                b = ((byte)(bytes[i] & 0xF));
                c[i * 2 + 1] = (char)(b > 9 ? b + 0x37 : b + 0x30);
            }
            return c;
        }
    }
}