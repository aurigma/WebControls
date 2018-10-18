// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading;
using System.Web.Hosting;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.VirtualPath
{
    internal class VirtualPathProvider : System.Web.Hosting.VirtualPathProvider
    {
        private volatile static VirtualPathProvider _instance;
        private static readonly object _syncRoot = new object();

        private Dictionary<string, Func<VirtualFile>> _registeredFiles = new Dictionary<string, Func<VirtualFile>>(StringComparer.OrdinalIgnoreCase);
        private ReaderWriterLockSlim _collectionLock = new ReaderWriterLockSlim();

        private static bool EnsureProviderRegistered()
        {
            if (_instance == null)
            {
                lock (_syncRoot)
                {
                    if (_instance == null)
                    {
                        // RegisterVirtualPathProvider doesn't work with precompiled sites.
                        // Here you can see a little workaround.

                        HostingEnvironment hostingEnvironmentInstance = (HostingEnvironment)typeof(HostingEnvironment).InvokeMember("_theHostingEnvironment", BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.GetField, null, null, null);
                        if (hostingEnvironmentInstance == null)
                        {
                            return false;
                        }
                        MethodInfo mi = typeof(HostingEnvironment).GetMethod("RegisterVirtualPathProviderInternal", BindingFlags.NonPublic | BindingFlags.Static);
                        if (mi == null)
                        {
                            return false;
                        }

                        _instance = new VirtualPathProvider();
                        mi.Invoke(hostingEnvironmentInstance, new object[] { _instance });
                    }
                }
            }
            return true;
        }

        public static void RegisterVirtualFile(string path, Func<VirtualFile> virtualFile)
        {
            if (path == null)
            {
                throw new ArgumentNullException("path");
            }

            if (virtualFile == null)
            {
                throw new ArgumentNullException("virtualFile");
            }

            EnsureProviderRegistered();

            var lk = _instance._collectionLock;
            lk.EnterUpgradeableReadLock();
            try
            {
                bool registered = _instance._registeredFiles.ContainsKey(path);
                if (!registered)
                {
                    lk.EnterWriteLock();
                    try
                    {
                        _instance._registeredFiles.Add(path, virtualFile);
                    }
                    finally
                    {
                        lk.ExitWriteLock();
                    }
                }
            }
            finally
            {
                lk.ExitUpgradeableReadLock();
            }
        }

        public override VirtualFile GetFile(string virtualPath)
        {
            Func<VirtualFile> file;
            bool hasFile = false;

            var lk = _instance._collectionLock;
            lk.EnterReadLock();
            try
            {
                hasFile = _registeredFiles.TryGetValue(virtualPath, out file);
            }
            finally
            {
                lk.ExitReadLock();
            }

            if (hasFile)
            {
                return file();
            }
            else
            {
                return base.GetFile(virtualPath);
            }
        }

        public override bool FileExists(string virtualPath)
        {
            bool hasFile = false;
            var lk = _instance._collectionLock;
            lk.EnterReadLock();
            try
            {
                hasFile = _registeredFiles.ContainsKey(virtualPath);
            }
            finally
            {
                lk.ExitReadLock();
            }

            return hasFile || base.FileExists(virtualPath);
        }
    }
}