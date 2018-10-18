// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.Logger;
using System;
using System.Reflection;
using System.Web;
using System.Web.Hosting;

namespace Aurigma.GraphicsMill.AjaxControls
{
    public sealed class Configuration : IConfiguration
    {
        internal const string ClientScriptsVersion = "4_5_0";

        private const string _cacheFolderName = "GraphicsMillAjaxCache";
        private const string _cacheHandlerName = "E5A137A26E1B453D9CD7FF4F9D54D5EA";

        private string _clientScriptsLocation;

        private string _relativePublicCachePath;

        private string _absolutePublicCachePath;
        private string _absolutePrivateCachePath;
        private int _privateCacheMaxLifeTime;
        private int _privateCacheMaxFileCount;
        private int _publicCacheMaxLifeTime;
        private int _publicCacheMaxFileCount;
        private bool _cachePathValidated;
        private bool _useAutoDeployedFileCache;
        private bool _autoDeployedCacheInitialized;
        private string _fileCacheHandlerPath;

        private Configuration()
        {
            _clientScriptsLocation = "";

            _relativePublicCachePath = "";
            _absolutePublicCachePath = "";
            _absolutePrivateCachePath = "";
            _privateCacheMaxLifeTime = 86400;
            _privateCacheMaxFileCount = 100000;
            _publicCacheMaxLifeTime = 86400;
            _publicCacheMaxFileCount = 100000;

            // Read setting from configuration file
            System.Collections.Specialized.NameValueCollection webConfigKeys =
                (System.Collections.Specialized.NameValueCollection)System.Configuration.ConfigurationManager.GetSection("Aurigma.GraphicsMill.AjaxControls");

            if (webConfigKeys == null)
            {
                _useAutoDeployedFileCache = true;

                InitAutoDeployedFileCache();
            }
            else
            {
                // Read cache life time and size settings
                ReadIntegerValueFromConfig(webConfigKeys, "PrivateCacheMaxLifeTime", ref _privateCacheMaxLifeTime);
                ReadIntegerValueFromConfig(webConfigKeys, "PrivateCacheMaxFileCount", ref _privateCacheMaxFileCount);
                ReadIntegerValueFromConfig(webConfigKeys, "PublicCacheMaxLifeTime", ref _publicCacheMaxLifeTime);
                ReadIntegerValueFromConfig(webConfigKeys, "PublicCacheMaxFileCount", ref _publicCacheMaxFileCount);

                // Init cache pathes

                // RelativePublicCachePath
                if (!ReadStringValueFromConfig(webConfigKeys, "RelativePublicCachePath", ref _relativePublicCachePath))
                {
                    InitAutoDeployedFileCache();
                    return;
                }
                else
                {
                    _absolutePublicCachePath = HttpContext.Current.Server.MapPath(_relativePublicCachePath);
                    if (!_absolutePublicCachePath.EndsWith("/"))
                        _absolutePublicCachePath += "/";
                }

                // AbsolutePrivateCachePath and RelativePrivateCachePath
                if (!ReadStringValueFromConfig(webConfigKeys, "AbsolutePrivateCachePath", ref _absolutePrivateCachePath))
                {
                    string strRelativePrivateCachePath = "";
                    if (!ReadStringValueFromConfig(webConfigKeys, "RelativePrivateCachePath", ref strRelativePrivateCachePath))
                    {
                        InitAutoDeployedFileCache();
                        return;
                    }
                    else
                    {
                        _absolutePrivateCachePath = HttpContext.Current.Server.MapPath(strRelativePrivateCachePath);
                    }
                }

                ValidateCachePath();
            }
        }

        #region Public members

        // Thread-safe lazy singletom implementation
        // http://msdn.microsoft.com/en-us/library/ms998558.aspx
        private static volatile IConfiguration _instance;

        private static object _syncRoot = new Object();

        /// <summary>
        /// Config singleton instance
        /// </summary>
        public static IConfiguration Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (_syncRoot)
                    {
                        if (_instance == null)
                        {
                            if (FactoryMethod != null)
                            {
                                _instance = FactoryMethod();
                            }
                            else
                            {
                                _instance = new Configuration();
                            }
                        }

                        var config = _instance as Configuration;

                        // Default implementation requires some initialization
                        if (config != null)
                        {
                            // Cache initialization could fail during initial instance
                            if (config._useAutoDeployedFileCache)
                            {
                                if (!config._autoDeployedCacheInitialized)
                                {
                                    config.InitAutoDeployedFileCache();
                                }
                            }
                            else
                            {
                                if (!config._cachePathValidated)
                                {
                                    config.ValidateCachePath();
                                }
                            }
                        }
                    }
                }

                return _instance;
            }
        }

        private static readonly Lazy<ILogger> _lazyLogger =
            new Lazy<ILogger>(() => LoggerFactory != null ? LoggerFactory() : new NullLogger());

        public static ILogger Logger { get { return _lazyLogger.Value; } }

        /// <summary>
        /// Factory method to inject custom IConfiguration implementation into the singleton value.
        /// </summary>
        public static ConfigFactoryMethod FactoryMethod { get; set; }

        public static LoggerFactoryMethod LoggerFactory { get; set; }

        public bool UseAutoDeployedFileCache
        {
            get
            {
                return _useAutoDeployedFileCache;
            }
        }

        public string FileCacheHandlerPath
        {
            get
            {
                return _fileCacheHandlerPath;
            }
        }

        public string ClientScriptsLocation
        {
            get
            {
                return _clientScriptsLocation;
            }
        }

        public string RelativePublicCachePath
        {
            get
            {
                return _relativePublicCachePath;
            }
        }

        public string AbsolutePublicCachePath
        {
            get
            {
                return _absolutePublicCachePath;
            }
        }

        public string AbsolutePrivateCachePath
        {
            get
            {
                return _absolutePrivateCachePath;
            }
        }

        public int PrivateCacheMaxLifeTime
        {
            get
            {
                return _privateCacheMaxLifeTime;
            }
        }

        public int PrivateCacheMaxFileCount
        {
            get
            {
                return _privateCacheMaxFileCount;
            }
        }

        public int PublicCacheMaxLifeTime
        {
            get
            {
                return _publicCacheMaxLifeTime;
            }
        }

        public int PublicCacheMaxFileCount
        {
            get
            {
                return _publicCacheMaxFileCount;
            }
        }

        #endregion Public members

        #region Private members

        private static bool ReadBooleanValueFromConfig(System.Collections.Specialized.NameValueCollection configKeys, string key, ref bool keyValue)
        {
            if (configKeys.Get(key) != null)
            {
                keyValue = bool.Parse(configKeys.Get(key));
                return true;
            }
            else
            {
                return false;
            }
        }

        private static bool ReadIntegerValueFromConfig(System.Collections.Specialized.NameValueCollection configKeys, string key, ref int keyValue)
        {
            if (configKeys.Get(key) != null)
            {
                keyValue = int.Parse(configKeys.Get(key), Common.GetNumberFormat());
                return true;
            }
            else
            {
                return false;
            }
        }

        private static bool ReadStringValueFromConfig(System.Collections.Specialized.NameValueCollection configKeys, string key, ref string keyValue)
        {
            if (configKeys.Get(key) != null)
            {
                keyValue = (string)(configKeys.Get(key));
                return true;
            }
            else
            {
                return false;
            }
        }

        private void InitAutoDeployedFileCache()
        {
            _useAutoDeployedFileCache = true;

            string appDataPhysicalPath = System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + "App_Data\\";

            // Check whether App_Data directory exists
            if (!System.IO.Directory.Exists(appDataPhysicalPath))
            {
                try
                {
                    System.IO.Directory.CreateDirectory(appDataPhysicalPath);
                }
                catch (System.UnauthorizedAccessException)
                {
                    System.Globalization.CultureInfo cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                    throw new System.UnauthorizedAccessException(String.Format(cultureInfo,
                        Resources.Messages.CanNotCreateAppDir, appDataPhysicalPath));
                }
            }

            // Cache path
            string fileCachePath = appDataPhysicalPath + _cacheFolderName + "\\";

            if (!System.IO.Directory.Exists(fileCachePath))
            {
                try
                {
                    System.IO.Directory.CreateDirectory(fileCachePath);
                }
                catch (System.UnauthorizedAccessException)
                {
                    System.Globalization.CultureInfo cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                    throw new System.UnauthorizedAccessException(String.Format(cultureInfo,
                        Resources.Messages.CanNotWriteAppDir, fileCachePath));
                }
            }

            // Public folder
            _absolutePublicCachePath = fileCachePath + "Public\\";

            if (!System.IO.Directory.Exists(_absolutePublicCachePath))
            {
                try
                {
                    System.IO.Directory.CreateDirectory(_absolutePublicCachePath);
                }
                catch (System.UnauthorizedAccessException)
                {
                    System.Globalization.CultureInfo cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                    throw new System.UnauthorizedAccessException(String.Format(cultureInfo,
                        Resources.Messages.CanNotWriteAppDir, _absolutePublicCachePath));
                }
            }

            // Private folder
            _absolutePrivateCachePath = fileCachePath + "Private\\";

            if (!System.IO.Directory.Exists(_absolutePrivateCachePath))
            {
                try
                {
                    System.IO.Directory.CreateDirectory(_absolutePrivateCachePath);
                }
                catch (System.UnauthorizedAccessException)
                {
                    System.Globalization.CultureInfo cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                    throw new System.UnauthorizedAccessException(String.Format(cultureInfo,
                        Resources.Messages.CanNotWriteAppDir, _absolutePrivateCachePath));
                }
            }

            _autoDeployedCacheInitialized = true;

            // For root ApplicationVirtualPath property returns "/" and for subapplications "/ApplicationName"
            string appPath = System.Web.Hosting.HostingEnvironment.ApplicationVirtualPath;
            if (appPath == null) return; // bug: 14539
            if (appPath[appPath.Length - 1] != '/')
            {
                appPath += "/";
            }

            _fileCacheHandlerPath = appPath + _cacheHandlerName + ".aspx";

            // RegisterVirtualPathProvider doesn't work with precompiled sites.
            // Here you can see a little workaround.

            FileCachePathProvider providerInstance = new FileCachePathProvider();

            HostingEnvironment hostingEnvironmentInstance = (HostingEnvironment)typeof(HostingEnvironment).InvokeMember("_theHostingEnvironment", BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.GetField, null, null, null);
            if (hostingEnvironmentInstance == null)
                return;

            MethodInfo mi = typeof(HostingEnvironment).GetMethod("RegisterVirtualPathProviderInternal", BindingFlags.NonPublic | BindingFlags.Static);
            if (mi == null)
                return;

            mi.Invoke(hostingEnvironmentInstance, new object[] { (VirtualPathProvider)providerInstance });
        }

        private void ValidateCachePath()
        {
            if (!System.IO.Directory.Exists(_absolutePrivateCachePath))
            {
                System.Globalization.CultureInfo cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                throw new System.IO.DirectoryNotFoundException(String.Format(cultureInfo, Resources.Messages.PrivateCacheDirDoesNotExist, _absolutePrivateCachePath));
            }

            if (!System.IO.Directory.Exists(_absolutePublicCachePath))
            {
                System.Globalization.CultureInfo cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                throw new System.IO.DirectoryNotFoundException(String.Format(cultureInfo, Resources.Messages.PublicCacheDirDoesNotExist, _absolutePublicCachePath));
            }

            _cachePathValidated = true;
        }

        #endregion Private members
    }

    /// <summary>
    /// Factory method to create configuration instance
    /// </summary>
    /// <returns></returns>
    public delegate IConfiguration ConfigFactoryMethod();

    public delegate ILogger LoggerFactoryMethod();
}