// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileStorage;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Logger;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Singleton;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Web.Hosting;
using AvoFileCache = Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileCache.FileCache;
using Path = System.IO.Path;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class Configuration : BaseConfiguration, IConfiguration
    {
        static Configuration()
        {
            FactoryMethod = _defaultFactoryMethod;
        }

        public static Func<ILogger> LoggerFactoryMethod { get; set; }

        public static ILogger Logger
        {
            get { return LoggerFactoryMethod != null ? LoggerFactoryMethod() : DotNetDebugLogger.Instance; }
        }

        private static readonly Func<IFileStorage> _defaultFileStorageFactoryMethod = () => new FileStorage.FileStorage();
        private static Func<IFileStorage> _fileStorageFactoryMethod = _defaultFileStorageFactoryMethod;

        public static Func<IFileStorage> FileStorageFactoryMethod
        {
            get { return _fileStorageFactoryMethod; }
            set
            {
                if (value == null)
                    return;

                _fileStorageFactoryMethod = value;
                _fileCacheFactory = new SingletonFactory<AvoFileCache>(() => new AvoFileCache(_fileStorageFactoryMethod()));
            }
        }

        private static SingletonFactory<AvoFileCache> _fileCacheFactory = new SingletonFactory<AvoFileCache>(() => new AvoFileCache(_defaultFileStorageFactoryMethod()));

        public static AvoFileCache FileCache
        {
            get { return _fileCacheFactory.GetInstance(); }
        }

        private readonly string _defaultHandlerUrl = "~/3F2550B9FAB84E2E92BBBE5AE004A618.ashx";
        private readonly string _defaultServiceUrl = "~/449E0E941A654CB08FDB229C6CC3FAB6.asmx";

        private static readonly string[] _allowedFontFileExtensions = { ".ttf", ".otf", ".woff" };

        public static IConfiguration Instance { get { return _factory.GetInstance(); } }

        private static readonly Func<IConfiguration> _defaultFactoryMethod = () => new Configuration();
        private static Func<IConfiguration> _factoryMethod;

        private static SingletonFactory<IConfiguration> _factory = new SingletonFactory<IConfiguration>(FactoryMethod);

        /// <summary>
        /// Factory method to inject custom IConfiguration implementation into the singleton value.
        /// </summary>
        public static Func<IConfiguration> FactoryMethod
        {
            get { return _factoryMethod; }
            set
            {
                var prevFactoryMethod = _factoryMethod;

                _factoryMethod = value ?? _defaultFactoryMethod;

                if (prevFactoryMethod != _factoryMethod)
                    _factory = new SingletonFactory<IConfiguration>(_factoryMethod);
            }
        }

        private Configuration() : base("Aurigma.GraphicsMill.AjaxControls.VectorObjects")
        {
            FontRegistry = new CustomFontRegistry(AdvancedDrawing.FontRegistry.Installed);

            SystemFonts = FontRegistry.Fonts
                .Select(fontInfo => new FontData(fontInfo) { System = true })
                .ToLookup(fd => fd.Family)
                .ToDictionary(g => g.Key, g => g.ToList() as IList<FontData>, StringComparer.InvariantCultureIgnoreCase);

            if (!string.IsNullOrEmpty(FontDirectory) && Directory.Exists(FontDirectory))
                RegisterFonts(FontDirectory);
        }

        private static bool HasAllowedExtension(string filename)
        {
            var ext = Path.GetExtension(filename).ToLowerInvariant();
            return !string.IsNullOrEmpty(ext) && _allowedFontFileExtensions.Contains(ext);
        }

        public void UpdateLocalFonts()
        {
            if (string.IsNullOrEmpty(FontDirectory) || !Directory.Exists(FontDirectory))
                return;

            lock (FontRegistry)
                FontRegistry = new CustomFontRegistry(AdvancedDrawing.FontRegistry.Installed);

            RegisterFonts(FontDirectory);
        }

        private void RegisterFonts(string folderName)
        {
            lock (LocalFonts)
            {
                LocalFonts.Clear();
                foreach (var filename in GetFontFiles(folderName).Where(HasAllowedExtension))
                    RegisterLocalFont(filename);
            }
        }

        private void RegisterLocalFont(string filename)
        {
            string psName;
            FontInfo fontInfo;

            lock (FontRegistry)
            {
                try
                {
                    psName = FontRegistry.Add(filename);
                }
                catch (Exception e)
                {
                    Logger.Warning(string.Format("Unable to load custom font {0}", filename), e);
                    return;
                }

                fontInfo = FontRegistry.Fonts.First(fi => fi.PostscriptName == psName);
            }

            IList<FontData> familyFonts;

            if (!LocalFonts.TryGetValue(fontInfo.Family, out familyFonts))
                familyFonts = LocalFonts[fontInfo.Family] = new List<FontData>();

            var fontData = familyFonts.FirstOrDefault(f =>
                f.PostScriptName.Equals(psName, StringComparison.InvariantCultureIgnoreCase) &&
                f.Style.Equals(psName, StringComparison.InvariantCultureIgnoreCase));

            if (fontData == null)
                fontData = new FontData
                {
                    PostScriptName = psName,
                    Style = fontInfo.Style,
                    Family = fontInfo.Family,
                    FullName = fontInfo.FullName
                };

            fontData.FileNames.Add(filename);

            familyFonts.Add(fontData);
        }

        private static IEnumerable<string> GetFontFiles(string path)
        {
            var files = new List<string>();
            foreach (var pattern in _allowedFontFileExtensions.Select(e => string.Format("*{0}", e)))
            {
                files.AddRange(Directory.GetFiles(path, pattern, SearchOption.AllDirectories));
            }
            files.Sort();

            return files;
        }

        private static string ToAbsolutePath(string path)
        {
            if (path != null && path.StartsWith("~"))
                return HostingEnvironment.MapPath(path);

            return path;
        }

        #region IConfiguration Members

        /// <summary>
        /// Get "GrayscaleColorProfileFileName" parameter value from web.config.
        /// </summary>
        public string GrayscaleColorProfileFileName
        {
            get
            {
                return ToAbsolutePath(GetParameter("GrayscaleColorProfileFileName"));
            }
        }

        /// <summary>
        /// Get "RgbColorProfileFileName" parameter value from web.config.
        /// </summary>
        public string RgbColorProfileFileName
        {
            get
            {
                return ToAbsolutePath(GetParameter("RgbColorProfileFileName"));
            }
        }

        /// <summary>
        /// Get "CmykColorProfileFileName" parameter value from web.config.
        /// </summary>
        public string CmykColorProfileFileName
        {
            get
            {
                return ToAbsolutePath(GetParameter("CmykColorProfileFileName"));
            }
        }

        /// <summary>
        /// Get "AllowDownloadImageToCache" parameter value from web.config.
        /// </summary>
        public bool AllowDownloadImageToCache
        {
            get
            {
                string value = GetParameter("AllowDownloadImageToCache");
                bool res = true; // Allow download to cache by default
                if (value != null)
                {
                    bool.TryParse(value, out res);
                }
                return res;
            }
        }

        public string TempDirectory
        {
            get
            {
                var tempDirectory = ToAbsolutePath(GetParameter("TempDirectory"));
                if (tempDirectory == null || string.IsNullOrEmpty(tempDirectory.Trim()))
                    tempDirectory = Path.GetTempPath();

                return tempDirectory;
            }
        }

        public string ColorProfilesDirectory
        {
            get
            {
                return ToAbsolutePath(GetParameter("TempDirectory"));
            }
        }

        public string HandlerUrl
        {
            get
            {
                var handlerUrl = GetParameter("HandlerUrl");
                if (handlerUrl == null)
                {
                    handlerUrl = _defaultHandlerUrl;
                    Handler.RegisterHandler(handlerUrl);
                }
                return handlerUrl;
            }
        }

        /// <summary>
        /// Get "ServiceUrl" parameter value from web.config.
        /// </summary>
        public string ServiceUrl
        {
            get
            {
                var serviceUrl = GetParameter("ServiceUrl");
                if (serviceUrl == null)
                {
                    serviceUrl = _defaultServiceUrl;
                    Service.RegisterService(serviceUrl);
                }
                return serviceUrl;
            }
        }

        public string FontDirectory
        {
            get
            {
                return ToAbsolutePath(GetParameter("FontDirectory"));
            }
        }

        public CustomFontRegistry FontRegistry { get; private set; }

        #endregion IConfiguration Members

        public readonly Dictionary<string, IList<FontData>> SystemFonts;

        public readonly Dictionary<string, IList<FontData>> LocalFonts = new Dictionary<string, IList<FontData>>(StringComparer.InvariantCultureIgnoreCase);

        public class FontData
        {
            public FontData()
            {
            }

            public FontData(FontInfo fontInfo)
            {
                Family = fontInfo.Family;
                PostScriptName = fontInfo.PostscriptName;
                FullName = fontInfo.FullName;
                Style = fontInfo.Style;
            }

            private readonly List<string> _fileNames = new List<string>();

            public IList<string> FileNames
            {
                get { return _fileNames; }
            }

            public bool System = false;

            public string PostScriptName;
            public string Style;
            public string Family;
            public string FullName;
        }
    }

    public class ConfigurationException : InvalidOperationException
    {
        public ConfigurationException()
        {
        }

        public ConfigurationException(string message) : base(message)
        {
        }

        public ConfigurationException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected ConfigurationException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}