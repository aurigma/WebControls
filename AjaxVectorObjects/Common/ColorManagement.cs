// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Logger;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Resources;
using Aurigma.GraphicsMill.Codecs;
using Aurigma.GraphicsMill.Transforms;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class ColorManagement : IDisposable
    {
        private readonly FileCache.FileCache _fileCache = Configuration.FileCache;
        private readonly ILogger _logger = Configuration.Logger;

        #region color map

        private ColorMap _colorMap;

        private PixelFormat _colorMapDestinationPixelFormat;
        private ColorProfile _colorMapDestinationColorProfile;
        private ColorSpace? _colorMapTargetColorSpace;

        public void InitColorMap(IEnumerable<Color> colors, IImageParams destination)
        {
            var colorList = colors as IList<Color> ?? colors.ToList();

            if (HasColorMap(destination) && _colorMap.ContainsColors(colorList))
                return;

            if (_colorMap != null)
                _colorMap.Dispose();

            _colorMap = new ColorMap(colorList);

            _colorMapDestinationPixelFormat = destination.PixelFormat;
            _colorMapDestinationColorProfile = destination.ColorProfile;
            _colorMapTargetColorSpace = TargetColorSpace;

            foreach (var colorSpace in _colorMap.ColorSpaces)
            {
                var source = new ImageParams(GetPixelFormat(colorSpace), GetProfile(this, colorSpace));
                using (var converter = GetColorConverter(this, source, destination))
                {
                    if (converter != null)
                        _colorMap.Convert(converter, colorSpace);
                }
            }
        }

        public void InitPreviewColorMap(IEnumerable<Color> colors)
        {
            var destination = new ImageParams(PixelFormat.Format32bppArgb, GetSrgbProfile());
            InitColorMap(colors, destination);
        }

        private bool HasColorMap(IImageParams destination)
        {
            return _colorMap != null && _colorMapDestinationPixelFormat == destination.PixelFormat &&
                CompareProfiles(_colorMapDestinationColorProfile, destination.ColorProfile) &&
                _colorMapTargetColorSpace == TargetColorSpace;
        }

        #endregion color map

        public void Dispose()
        {
            if (_rgbColorProfile != null && _rgbColorProfile != _defaultRgbColorProfile)
                _rgbColorProfile.Dispose();

            if (_cmykColorProfile != null && _cmykColorProfile != _defaultCmykColorProfile)
                _cmykColorProfile.Dispose();

            if (_grayscaleColorProfile != null && _grayscaleColorProfile != _defaultGrayscaleColorProfile)
                _grayscaleColorProfile.Dispose();

            if (_colorMap != null)
                _colorMap.Dispose();
        }

        #region sRgb

        private static volatile ColorProfile _srgbColorProfile;
        private static readonly object _srgbSync = new object();

        public static ColorProfile GetSrgbProfile()
        {
            if (_srgbColorProfile == null)
            {
                lock (_srgbSync)
                {
                    if (_srgbColorProfile == null)
                        _srgbColorProfile = ColorProfile.FromSrgb();
                }
            }

            return _srgbColorProfile;
        }

        #endregion sRgb

        #region Cmyk

        private static volatile ColorProfile _defaultCmykColorProfile;
        private static volatile string _defaultCmykProfileId;
        private static readonly object _cmykSync = new object();

        private ColorProfile _cmykColorProfile;
        private string _cmykColorProfileFileId;

        /// <summary>
        /// Get default CMYK color profile. If configuration contains CmykColorProfileFileName,
        /// that color profile will be used as default CMYK color profile. Otherwise, embedded
        /// profile will be used (SWOP (Coated), 20%, GCR, Medium).
        /// </summary>
        /// <returns></returns>
        public static ColorProfile GetDefaultCmykColorProfile()
        {
            if (_defaultCmykColorProfile == null)
            {
                lock (_cmykSync)
                {
                    if (_defaultCmykColorProfile == null)
                    {
                        if (Configuration.Instance.CmykColorProfileFileName != null)
                        {
                            _defaultCmykColorProfile = new ColorProfile(Configuration.Instance.CmykColorProfileFileName);
                        }
                        else
                        {
                            var profile = ColorProfiles.CmykConvert;
                            var profilesDirectory = string.IsNullOrEmpty(Configuration.Instance.ColorProfilesDirectory)
                                ? Configuration.Instance.TempDirectory
                                : Configuration.Instance.ColorProfilesDirectory;

                            var profileFilePath = Path.Combine(profilesDirectory, "defaultCmykProfile.icm");

                            File.WriteAllBytes(profileFilePath, profile);

                            _defaultCmykColorProfile = new ColorProfile(profileFilePath);
                        }
                    }
                }
            }

            return _defaultCmykColorProfile;
        }

        public ColorProfile CmykColorProfile
        {
            get
            {
                if (_cmykColorProfile == null)
                    LoadDefaultCmykProfile();

                return _cmykColorProfile;
            }
            set
            {
                if (value != null)
                {
                    if (!CompareProfiles(CmykColorProfile, value))
                    {
                        _cmykColorProfile = value;
                        _cmykColorProfileFileId = SaveColorProfile(value);
                    }
                }
                else
                    LoadDefaultCmykProfile();
            }
        }

        public string CmykColorProfileFileId
        {
            get
            {
                if (_cmykColorProfileFileId == null)
                    LoadDefaultCmykProfile();

                return _cmykColorProfileFileId;
            }
            set
            {
                if (value != null)
                {
                    if (CmykColorProfileFileId != value)
                    {
                        _cmykColorProfileFileId = value;
                        _cmykColorProfile = LoadProfile(_cmykColorProfileFileId);
                        if (_cmykColorProfile == null)
                        {
                            _logger.Warning(string.Format("Cannot find CMYK profile with id {0}.", _cmykColorProfileFileId));
                            LoadDefaultCmykProfile();
                        }
                    }
                }
                else
                    LoadDefaultCmykProfile();
            }
        }

        private void LoadDefaultCmykProfile()
        {
            _cmykColorProfile = GetDefaultCmykColorProfile();

            if (!_fileCache.FileExists(_defaultCmykProfileId))
                _defaultCmykProfileId = SaveColorProfile(_cmykColorProfile);

            _cmykColorProfileFileId = _defaultCmykProfileId;
        }

        #endregion Cmyk

        #region Rgb

        private static volatile ColorProfile _defaultRgbColorProfile;
        private static volatile string _defaultRgbColorProfileId;
        private static readonly object _rgbSync = new object();

        private ColorProfile _rgbColorProfile;
        private string _rgbColorProfileFileId;

        /// <summary>
        /// Get default RGB color profile. If configuration contains RgbColorProfileFileName,
        /// that color profile will be used as default RGB color profile. Otherwise, embedded
        /// profile will be used (sRGB IEC61966-2.1).
        /// </summary>
        /// <returns></returns>
        public static ColorProfile GetDefaultRgbProfile()
        {
            if (_defaultRgbColorProfile == null)
            {
                lock (_rgbSync)
                {
                    if (_defaultRgbColorProfile == null)
                    {
                        _defaultRgbColorProfile = Configuration.Instance.RgbColorProfileFileName != null
                            ? new ColorProfile(Configuration.Instance.RgbColorProfileFileName)
                            : GetSrgbProfile();
                    }
                }
            }

            return _defaultRgbColorProfile;
        }

        public ColorProfile RgbColorProfile
        {
            get
            {
                if (_rgbColorProfile == null)
                    LoadDefaultRgbProfile();

                return _rgbColorProfile;
            }
            set
            {
                if (value != null)
                {
                    if (!CompareProfiles(RgbColorProfile, value))
                    {
                        _rgbColorProfile = value;
                        _rgbColorProfileFileId = SaveColorProfile(_rgbColorProfile);
                    }
                }
                else
                    LoadDefaultRgbProfile();
            }
        }

        public string RgbColorProfileFileId
        {
            get
            {
                if (_rgbColorProfileFileId == null)
                    LoadDefaultRgbProfile();

                return _rgbColorProfileFileId;
            }
            set
            {
                if (value != null)
                {
                    if (RgbColorProfileFileId != value)
                    {
                        _rgbColorProfileFileId = value;
                        _rgbColorProfile = LoadProfile(_rgbColorProfileFileId);
                        if (_rgbColorProfile == null)
                        {
                            _logger.Warning(string.Format("Cannot find RGB profile with id {0}.", _rgbColorProfileFileId));
                            LoadDefaultRgbProfile();
                        }
                    }
                }
                else
                    LoadDefaultRgbProfile();
            }
        }

        private void LoadDefaultRgbProfile()
        {
            _rgbColorProfile = GetDefaultRgbProfile();

            if (!_fileCache.FileExists(_defaultRgbColorProfileId))
                _defaultRgbColorProfileId = SaveColorProfile(_rgbColorProfile);

            _rgbColorProfileFileId = _defaultRgbColorProfileId;
        }

        #endregion Rgb

        #region Grayscale

        private static volatile ColorProfile _defaultGrayscaleColorProfile;
        private static volatile string _defaultGrayscaleProfileId;
        private static readonly object _grayscaleSync = new object();

        private ColorProfile _grayscaleColorProfile;
        private string _grayscaleColorProfileFileId;

        /// <summary>
        /// Get default Grayscale color profile. if configuration contains GrayscaleColorProfileFileName,
        /// that color profile will be used as default Grayscale color profile. Otherwise, embedded
        /// profile will be used (Dot Gain 30%).
        /// </summary>
        /// <returns></returns>
        public static ColorProfile GetDefaultGrayscaleProfile()
        {
            if (_defaultGrayscaleColorProfile == null)
            {
                lock (_grayscaleSync)
                {
                    if (_defaultGrayscaleColorProfile == null)
                    {
                        if (Configuration.Instance.GrayscaleColorProfileFileName != null)
                        {
                            _defaultGrayscaleColorProfile = new ColorProfile(Configuration.Instance.GrayscaleColorProfileFileName);
                        }
                        else
                        {
                            var profile = ColorProfiles.GrayConvert;
                            var profilesDirectory = string.IsNullOrEmpty(Configuration.Instance.ColorProfilesDirectory)
                                ? Configuration.Instance.TempDirectory
                                : Configuration.Instance.ColorProfilesDirectory;

                            var profileFilePath = Path.Combine(profilesDirectory, "defaultGrayscaleProfile.icm");

                            File.WriteAllBytes(profileFilePath, profile);

                            _defaultGrayscaleColorProfile = new ColorProfile(profileFilePath);
                        }
                    }
                }
            }

            return _defaultGrayscaleColorProfile;
        }

        public ColorProfile GrayscaleColorProfile
        {
            get
            {
                if (_grayscaleColorProfile == null)
                    LoadDefaultGrayscaleProfile();

                return _grayscaleColorProfile;
            }
            set
            {
                if (value != null)
                {
                    if (!CompareProfiles(GrayscaleColorProfile, value))
                    {
                        _grayscaleColorProfile = value;
                        _grayscaleColorProfileFileId = SaveColorProfile(_grayscaleColorProfile);
                    }
                }
                else
                    LoadDefaultGrayscaleProfile();
            }
        }

        public string GrayscaleColorProfileFileId
        {
            get
            {
                if (_grayscaleColorProfileFileId == null)
                    LoadDefaultGrayscaleProfile();

                return _grayscaleColorProfileFileId;
            }
            set
            {
                if (value != null)
                {
                    if (GrayscaleColorProfileFileId != value)
                    {
                        _grayscaleColorProfileFileId = value;
                        _grayscaleColorProfile = LoadProfile(_grayscaleColorProfileFileId);
                        if (_grayscaleColorProfile == null)
                        {
                            _logger.Warning(string.Format("Cannot find Grayscale profile with id {0}.", _grayscaleColorProfileFileId));
                            LoadDefaultGrayscaleProfile();
                        }
                    }
                }
                else
                    LoadDefaultGrayscaleProfile();
            }
        }

        private void LoadDefaultGrayscaleProfile()
        {
            _grayscaleColorProfile = GetDefaultGrayscaleProfile();

            if (!_fileCache.FileExists(_defaultGrayscaleProfileId))
                _defaultGrayscaleProfileId = SaveColorProfile(_grayscaleColorProfile);

            _grayscaleColorProfileFileId = _defaultGrayscaleProfileId;
        }

        #endregion Grayscale

        public ColorSpace? TargetColorSpace = null;

        private ColorProfile LoadProfile(string id)
        {
            ColorProfile profile;

            using (var profileStream = _fileCache.GetReadStream(id))
            {
                if (profileStream == null)
                    return null;

                profile = new ColorProfile(profileStream);
            }

            return profile;
        }

        private string SaveColorProfile(ColorProfile profile)
        {
            return SaveColorProfile(profile, _fileCache);
        }

        #region static stuff

        public static string SaveColorProfile(ColorProfile profile, FileCache.FileCache cache)
        {
            using (var stream = new MemoryStream())
            {
                profile.Save(stream);
                stream.Position = 0;

                return cache.AddFile("tmp", stream);
            }
        }

        public static ColorProfile GetProfile(ColorManagement colorManagement, ColorSpace colorSpace, bool isPreview = false)
        {
            if (colorManagement == null)
                return null;

            switch (colorSpace)
            {
                case ColorSpace.Cmyk:
                    return colorManagement.CmykColorProfile;

                case ColorSpace.Grayscale:
                    return colorManagement.GrayscaleColorProfile;

                case ColorSpace.Rgb:
                    return isPreview ? GetSrgbProfile() : colorManagement.RgbColorProfile;

                default:
                    return null;
            }
        }

        public static ColorProfile GetTargetProfile(ColorManagement colorManagement)
        {
            if (colorManagement == null || !colorManagement.TargetColorSpace.HasValue)
                return null;

            return GetProfile(colorManagement, colorManagement.TargetColorSpace.Value);
        }

        public static ColorConverter GetColorConverter(ColorManagement colorManagement, IImageParams source, ColorSpace destinationColorSpace)
        {
            return GetColorConverter(colorManagement, source, GetPixelFormat(destinationColorSpace));
        }

        public static ColorConverter GetColorConverter(ColorManagement colorManagement, IImageParams source, PixelFormat destinationPixelFormat, bool isPreview = false)
        {
            var destination = new ImageParams(destinationPixelFormat, GetProfile(colorManagement, destinationPixelFormat.ColorSpace, isPreview));

            return GetColorConverter(colorManagement, source, destination);
        }

        public static ColorConverter GetColorConverter(ColorManagement colorManagement, IImageParams source, PixelFormat destinationPixelFormat, ColorProfile destinationProfile)
        {
            var destination = new ImageParams(destinationPixelFormat, destinationProfile);

            return GetColorConverter(colorManagement, source, destination);
        }

        public static ColorConverter GetColorConverter(ColorManagement colorManagement, IImageParams source, IImageParams destination)
        {
            if (colorManagement != null)
            {
                var targetProfile = GetTargetProfile(colorManagement);
                if (!CompareProfiles(source.ColorProfile, destination.ColorProfile) || targetProfile != null && !CompareProfiles(targetProfile, destination.ColorProfile))
                {
                    return new ColorConverter
                    {
                        ColorManagementEngine = ColorManagementEngine.LittleCms,
                        DestinationPixelFormat = destination.PixelFormat,
                        DestinationProfile = destination.ColorProfile,
                        DefaultSourceProfile = GetProfile(colorManagement, source.PixelFormat.ColorSpace),
                        TargetDeviceProfile = targetProfile
                    };
                }
                return null;
            }

            if (source.PixelFormat != destination.PixelFormat &&
                (source.PixelFormat.ColorSpace != destination.PixelFormat.ColorSpace || source.PixelFormat.IsExtended != destination.PixelFormat.IsExtended ||
                 source.PixelFormat.IsIndexed != destination.PixelFormat.IsIndexed || (!source.PixelFormat.HasAlpha && destination.PixelFormat.HasAlpha)))
            {
                return new ColorConverter
                {
                    ColorManagementEngine = ColorManagementEngine.None,
                    DestinationPixelFormat = destination.PixelFormat
                };
            }
            return null;
        }

        public static Color ConvertColor(ColorManagement colorManagement, Color color, IImageParams destination)
        {
            var result = GetColorFromColorMap(colorManagement, color, destination);
            if (result != null)
                return result;

            var source = new ImageParams(color.PixelFormat, GetProfile(colorManagement, color.ColorSpace));
            var colorConverter = GetColorConverter(colorManagement, source, destination);

            return colorConverter != null ? colorConverter.ConvertColor(color, source.ColorProfile) : color;
        }

        public static RgbColor GetPreviewColor(ColorManagement colorManagement, Color color)
        {
            var destination = new ImageParams(GetPixelFormat(ColorSpace.Rgb), GetSrgbProfile());
            return (RgbColor)ConvertColor(colorManagement, color, destination);
        }

        internal static Color GetColorFromColorMap(ColorManagement colorManagement, Color color, IImageParams destination)
        {
            if (colorManagement == null || !colorManagement.HasColorMap(destination))
                return null;

            return colorManagement._colorMap.GetColor(color);
        }

        public static bool CompareProfiles(ColorProfile cp1, ColorProfile cp2)
        {
            var equal = ReferenceEquals(cp1, cp2);
            equal |= cp1 != null && cp2 != null &&
                     cp1.Description == cp2.Description &&
                     cp1.ColorSpace == cp2.ColorSpace;
            return equal;
        }

        public static PixelFormat GetPixelFormat(ColorSpace colorSpace)
        {
            return GetPixelFormat(colorSpace, true);
        }

        public static PixelFormat GetPixelFormat(ColorSpace colorSpace, bool withAlpha)
        {
            var format = PixelFormat.Format32bppArgb;
            switch (colorSpace)
            {
                case ColorSpace.Cmyk:
                    format = PixelFormat.Format40bppAcmyk;
                    break;

                case ColorSpace.Grayscale:
                    format = PixelFormat.Format16bppAgrayscale;
                    break;

                case ColorSpace.Rgb:
                    format = PixelFormat.Format32bppArgb;
                    break;
            }

            if (!withAlpha)
            {
                format = PixelFormat.DiscardAlpha(format);
            }

            return format;
        }

        public static Color GetTransparentColor(PixelFormat pixelFormat)
        {
            return GetTransparentColor(pixelFormat.ColorSpace);
        }

        public static Color GetTransparentColor(ColorSpace colorSpace)
        {
            switch (colorSpace)
            {
                case ColorSpace.Cmyk:
                    return new CmykColor(0, 0, 0, 0, 0);

                case ColorSpace.Grayscale:
                    return new GrayscaleColor(0, 0);

                case ColorSpace.Rgb:
                    return new RgbColor(0, 0, 0, 0);

                default:
                    throw new ArgumentException(Exceptions.ConNotGetDefaultColorForUnknownColorSpace);
            }
        }

        public static Color GetBlackColor(ColorSpace colorSpace)
        {
            switch (colorSpace)
            {
                case ColorSpace.Cmyk:
                    return new CmykColor(255, 255, 255, 255, 255);

                case ColorSpace.Grayscale:
                    return new GrayscaleColor(0, 255);

                case ColorSpace.Rgb:
                    return new RgbColor(0, 0, 0, 255);

                default:
                    throw new ArgumentException();
            }
        }

        public static Color GetWhiteColor(ColorSpace colorSpace)
        {
            switch (colorSpace)
            {
                case ColorSpace.Cmyk:
                    return new CmykColor(0, 0, 0, 0, 0);

                case ColorSpace.Grayscale:
                    return new GrayscaleColor(255, 0);

                case ColorSpace.Rgb:
                    return new RgbColor(255, 255, 255, 0);

                default:
                    throw new ArgumentException();
            }
        }

        public static PixelFormat DiscardExtended(PixelFormat pixelformat)
        {
            return PixelFormat.ConvertToSimple(pixelformat);
        }

        public static string FixColorProfile(string filePath)
        {
            using (var data = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                return FixColorProfile(data);
            }
        }

        public static string FixColorProfile(Stream fileData)
        {
            return FixColorProfile(fileData, null);
        }

        private static string FixColorProfile(Stream fileData, string filename)
        {
            string filePath = null;

            var position = fileData.Position;
            using (var reader = ImageReader.Create(fileData))
            {
                if (reader.ColorProfile != null && IsColorProfileIncorrectOrCorrupted(reader))
                {
                    Configuration.Logger.Warning(string.Format("Image {0} contains incorrect or currupted color profile. The profile will be deleted.", filename ?? ""));
                    filePath = DeleteColorProfile(fileData, reader.FileFormat);
                }
            }
            fileData.Position = position;

            return filePath;
        }

        private static string DeleteColorProfile(Stream fileData, FileFormat format)
        {
            try
            {
                var tempFilePath = Common.GetTempFilePath(format);

                using (var bitmap = new Bitmap(fileData))
                {
                    bitmap.ColorProfile = null;
                    bitmap.Save(tempFilePath, Common.GetWriterSettings(format));
                }

                return tempFilePath;
            }
            catch (Exception e)
            {
                throw new InvalidOperationException("Unable to delete incurrect or currupted color profile.", e);
            }
        }

        private static bool IsColorProfileIncorrectOrCorrupted(IImageParams reader)
        {
            if (reader.PixelFormat.ColorSpace != reader.ColorProfile.ColorSpace)
                return true;

            var pipeline = new Pipeline();
            try
            {
                pipeline.Add(new ImageGenerator(1, 1, reader.PixelFormat, GetTransparentColor(reader.PixelFormat)) { ColorProfile = reader.ColorProfile });
                pipeline.Add(new ColorConverter { DestinationPixelFormat = PixelFormat.Format32bppArgb, DestinationProfile = GetSrgbProfile(), ColorManagementEngine = ColorManagementEngine.LittleCms });
                pipeline.Add(new Bitmap());
                pipeline.Run();
            }
            catch (CMInappropriateProfileException)
            {
                return true;
            }
            finally
            {
                pipeline.DisposeAllElements();
            }

            return false;
        }

        #endregion static stuff

        #region ImageParams

        private class ImageParams : IImageParams
        {
            public ImageParams(PixelFormat pixelFormat, ColorProfile colorProfile)
            {
                ColorProfile = colorProfile;
                PixelFormat = pixelFormat;
            }

            public ColorProfile ColorProfile { get; private set; }
            public PixelFormat PixelFormat { get; private set; }

            public int Width { get { throw new NotSupportedException(); } }
            public int Height { get { throw new NotSupportedException(); } }
            public float DpiX { get { throw new NotSupportedException(); } }
            public float DpiY { get { throw new NotSupportedException(); } }
            public ColorPalette Palette { get { throw new NotSupportedException(); } }
            public Ink Ink { get { throw new NotSupportedException(); } }
        }

        #endregion ImageParams
    }
}