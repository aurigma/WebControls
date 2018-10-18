// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class CurvedTextVObjectData : BaseTextVObjectData
    {
        public CurvedTextVObjectData()
        { }

        public CurvedTextVObjectData(CurvedTextVObject obj)
            : base(obj)
        {
            TPth = obj.TextPath.ToSvgString();
            FTP = obj.FitToPath;
            Str = obj.Stretch;
            OFS = obj.OriginalFontSize;
            FTPS = obj.FitToPathStep;
            AA = obj.ActualAngle;
            PS = obj.PathStart;
            PE = obj.PathEnd;
        }

        public override void ApplyState(VObject obj)
        {
            // Backward compatibility
            Path textPath;
            if (TPth == null && Pth != null)
            {
                textPath = Path.FromSvgString(Pth);
                Pth = null;
            }
            else
            {
                textPath = Path.FromSvgString(TPth);
            }

            base.ApplyState(obj);

            var t = (CurvedTextVObject)obj;
            t.TextPath = textPath;
            t.FitToPath = FTP;
            t.Stretch = Str;
            t.OriginalFontSize = OFS;
            t.FitToPathStep = FTPS;
            t.ActualAngle = AA;
            t.PathStart = PS;
            t.PathEnd = PE;
        }

        /// <summary>
        /// Path
        /// </summary>
        public string TPth { get; set; }

        /// <summary>
        /// FitToPath
        /// </summary>
        public bool FTP { get; set; }

        /// <summary>
        /// Stretch
        /// </summary>
        public bool Str { get; set; }

        /// <summary>
        /// OriginalFontSize
        /// </summary>
        public float OFS { get; set; }

        /// <summary>
        /// FitToPathStep
        /// </summary>
        public float FTPS { get; set; }

        /// <summary>
        /// ActualAngle
        /// </summary>
        public double AA { get; set; }

        /// <summary>
        /// PathStart
        /// </summary>
        public float PS { get; set; }

        /// <summary>
        /// PathEnd
        /// </summary>
        public float PE { get; set; }
    }
}