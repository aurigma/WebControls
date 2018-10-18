// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.Logger
{
    public interface ILogger
    {
        void Trace(string message);

        void Trace(string message, Exception ex);

        void Warning(string message);

        void Warning(string message, Exception ex);

        void Error(string message);

        void Error(string message, Exception ex);
    }
}