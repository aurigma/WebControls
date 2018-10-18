// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class BaseTextVObjectData : ContentVObjectData
    {
        public BaseTextVObjectData()
        {
        }

        public BaseTextVObjectData(BaseTextVObject obj)
            : base(obj)
        {
            Txt = obj.Text.Replace("&", "&amp;").Replace("\"", "&quot;").Replace("<", "&lt;").Replace(">", "&gt;");

            F_FB = obj.Font.FauxBold;
            F_FI = obj.Font.FauxItalic;
            F_N = obj.Font.PostScriptName;
            F_S = obj.Font.Size;

            TC = obj.TextColor;
            U = obj.Underline;
            A = obj.Alignment;
            Tr = obj.Tracking;
            Ld = obj.Leading;
            CFI = obj.CurrentFileId;
            IRT = obj.IsRichText;
            VS = obj.VerticalScale;
            HS = obj.HorizontalScale;
        }

        public override void ApplyState(VObject obj)
        {
            base.ApplyState(obj);

            var t = (BaseTextVObject)obj;
            t.Text = Txt.Replace("&gt;", ">").Replace("&lt;", "<").Replace("&quot;", "\"").Replace("&amp;", "&");

            // Backward compatibility
            if (F_N == null && FN != null)
            {
                var font = FontService.FindSuitableFont(FN, B, I, S);
                t.Font.FauxBold = font.FauxBold;
                t.Font.FauxItalic = font.FauxItalic;
                t.Font.PostScriptName = font.PostScriptName;
                t.Font.Size = FS;
            }
            else
            {
                t.Font.FauxBold = F_FB;
                t.Font.FauxItalic = F_FI;
                t.Font.PostScriptName = F_N;
                t.Font.Size = F_S;
            }

            t.TextColor = TC;
            t.Underline = U;
            t.SetInternalAlignment(A);
            t.Tracking = Tr;
            t.Leading = Ld;
            t.CurrentFileId = CFI;
            t.IsRichText = IRT;
            t.VerticalScale = VS;
            t.HorizontalScale = HS;
        }

        /// <summary>
        /// Alignment
        /// </summary>
        public TextAlignment A { get; set; }

        /// <summary>
        /// Underline
        /// </summary>
        public bool U { get; set; }

        /// <summary>
        /// Text
        /// </summary>
        public string Txt { get; set; }

        /// <summary>
        /// Font.PostScriptName
        /// </summary>
        public string F_N { get; set; }

        /// <summary>
        /// Font.Style
        /// </summary>
        public float F_S { get; set; }

        /// <summary>
        /// Font.FauxBold
        /// </summary>
        public bool F_FB { get; set; }

        /// <summary>
        /// Font.FauxItalic
        /// </summary>
        public bool F_FI { get; set; }

        /// <summary>
        /// TextColor
        /// </summary>
        public Color TC { get; set; }

        /// <summary>
        /// CurrentFileId
        /// </summary>
        public string CFI { get; set; }

        /// <summary>
        /// Tracking
        /// </summary>
        public float Tr { get; set; }

        /// <summary>
        /// Leading
        /// </summary>
        public float Ld { get; set; }

        /// <summary>
        /// IsRichText
        /// </summary>
        public bool IRT { get; set; }

        /// <summary>
        /// VerticalScale
        /// </summary>
        public float VS { get; set; }

        /// <summary>
        /// HorizontalScale
        /// </summary>
        public float HS { get; set; }

        // Backward compatibility
        public string FN { get; set; }

        public float FS { get; set; }
        public string S { get; set; }
        public bool B { get; set; }
        public bool I { get; set; }
    }
}