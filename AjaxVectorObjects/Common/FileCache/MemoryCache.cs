// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileCache
{
    public class MemoryCache
    {
        private readonly System.Runtime.Caching.MemoryCache _cache;

        public MemoryCache(string name)
        {
            if (name == null)
                throw new ArgumentNullException("name");

            _cache = new System.Runtime.Caching.MemoryCache(name);
        }

        public void Dispose()
        {
            _cache.Dispose();
        }

        public object Get(string key)
        {
            if (key == null)
                throw new ArgumentNullException("key");

            return _cache.Get(key);
        }

        public object Remove(string key)
        {
            if (key == null)
                throw new ArgumentNullException("key");

            return _cache.Remove(key);
        }

        public void Set(string key, object value)
        {
            if (key == null)
                throw new ArgumentNullException("key");

            if (value == null)
                throw new ArgumentNullException("value");

            _cache.Set(key, value, new System.Runtime.Caching.CacheItemPolicy());
        }
    }
}