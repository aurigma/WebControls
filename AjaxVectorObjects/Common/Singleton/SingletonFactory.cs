// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Singleton
{
    public class SingletonFactory<T> where T : class
    {
        private volatile T _instance;
        private readonly object _syncRoot = new object();
        private readonly Func<T> _factoryMethod;

        public SingletonFactory(Func<T> factoryMethod)
        {
            _factoryMethod = factoryMethod;
        }

        // Thread-safe lazy singleton implementation
        // http://msdn.microsoft.com/en-us/library/ms998558.aspx
        public T GetInstance()
        {
            if (_instance == null)
                lock (_syncRoot)
                    if (_instance == null)
                        _instance = _factoryMethod();

            return _instance;
        }
    }
}