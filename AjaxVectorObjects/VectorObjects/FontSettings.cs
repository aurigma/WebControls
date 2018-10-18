// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class FontSettings : BaseTextVObject.IFontSettings
    {
        public FontSettings()
        {
            PostScriptName = "ArialMT";
            Size = 10;
        }

        public FontSettings(BaseTextVObject.IFontSettings fontSettings)
        {
            PostScriptName = fontSettings.PostScriptName;
            Size = fontSettings.Size;
            FauxBold = fontSettings.FauxBold;
            FauxItalic = fontSettings.FauxItalic;
        }

        public string PostScriptName { get; set; }
        public float Size { get; set; }
        public bool FauxBold { get; set; }
        public bool FauxItalic { get; set; }

        public void CopyTo(BaseTextVObject.IFontSettings settings)
        {
            settings.Size = Size;
            settings.FauxBold = FauxBold;
            settings.FauxItalic = FauxItalic;
            settings.PostScriptName = PostScriptName;
        }

        public void CopyFrom(BaseTextVObject.IFontSettings settings)
        {
            Size = settings.Size;
            FauxBold = settings.FauxBold;
            FauxItalic = settings.FauxItalic;
            PostScriptName = settings.PostScriptName;
        }

        #region Equals

        protected bool Equals(FontSettings other)
        {
            return string.Equals(PostScriptName, other.PostScriptName) && Size.Equals(other.Size) && FauxBold == other.FauxBold && FauxItalic == other.FauxItalic;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((FontSettings)obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                var hashCode = (PostScriptName != null ? PostScriptName.GetHashCode() : 0);
                hashCode = (hashCode * 397) ^ Size.GetHashCode();
                hashCode = (hashCode * 397) ^ FauxBold.GetHashCode();
                hashCode = (hashCode * 397) ^ FauxItalic.GetHashCode();
                return hashCode;
            }
        }

        #endregion Equals
    }
}