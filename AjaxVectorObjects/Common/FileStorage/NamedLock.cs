// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections.Concurrent;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileStorage
{
    public class NamedLock
    {
        private readonly ConcurrentDictionary<string, object> _lockDict = new ConcurrentDictionary<string, object>();

        public object GetOrAddLock(string name)
        {
            return _lockDict.GetOrAdd(name, s => new object());
        }

        public object GetLock(string name)
        {
            object o;
            return _lockDict.TryGetValue(name, out o) ? o : new object();
        }

        public void RemoveLock(string name)
        {
            object o;
            _lockDict.TryRemove(name, out o);
        }
    }
}