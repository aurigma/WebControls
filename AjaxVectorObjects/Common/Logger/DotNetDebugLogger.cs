// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Singleton;
using System;
using System.Diagnostics;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Logger
{
    public class DotNetDebugLogger : ILogger
    {
        private static readonly SingletonFactory<DotNetDebugLogger> _factory = new SingletonFactory<DotNetDebugLogger>(() => new DotNetDebugLogger());

        public static ILogger Instance { get { return _factory.GetInstance(); } }

        private DotNetDebugLogger()
        {
        }

        public void Trace(string message)
        {
            Trace(message, null);
        }

        public void Trace(string message, Exception ex)
        {
            PrintMessage("Trace", message, ex);
        }

        public void Warning(string message)
        {
            Warning(message, null);
        }

        public void Warning(string message, Exception ex)
        {
            PrintMessage("Warning", message, ex);
        }

        public void Error(string message)
        {
            Error(message, null);
        }

        public void Error(string message, Exception ex)
        {
            PrintMessage("Error", message, ex);
        }

        private void PrintMessage(string level, string message, Exception ex)
        {
            var now = DateTime.Now;

            var timeStamp = string.Format("{0} {1}", now.ToShortDateString(), now.ToLongDateString());

            var exceptionString = ex == null ? "" : string.Format("{0}: {1}", ex.GetType(), ex.Message);

            try
            {
                Debug.WriteLine(string.Format("{0} {1} {2}", timeStamp, message, exceptionString), level);
            }
            catch (Exception)
            {
            }
        }
    }
}