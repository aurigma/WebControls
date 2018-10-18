// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.Logger
{
    internal class NullLogger : ILogger
    {
        public void Trace(string message)
        {
        }

        public void Trace(string message, Exception ex)
        {
        }

        public void Warning(string message)
        {
        }

        public void Warning(string message, Exception ex)
        {
        }

        public void Error(string message)
        {
        }

        public void Error(string message, Exception ex)
        {
        }
    }
}