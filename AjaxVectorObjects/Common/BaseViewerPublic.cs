// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    // Public Morozov class.
    internal abstract class BaseViewerPublic : BaseViewer
    {
        internal new static object InvokeRemoteScriptingMethod(Object instance, string methodName, object[] methodArgs)
        {
            return BaseViewer.InvokeRemoteScriptingMethod(instance, methodName, methodArgs);
        }
    }
}