// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.IO;

namespace Aurigma.GraphicsMill.AjaxControls.Logger
{
    public class FileLogger : ILogger
    {
        private string _path;

        public FileLogger(string path)
        {
            _path = path;
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

            var timeStamp = string.Format("{0} {1}", now.ToShortDateString(), now.ToLongTimeString());

            var exceptionString = ex == null ? "" : string.Format("{0}: {1}", ex.GetType(), ex.Message);

            try
            {
                using (var sw = File.AppendText(_path))
                {
                    sw.WriteLine("{0} {1} {2} {3}", timeStamp, level, message, exceptionString);
                }
            }
            catch (Exception)
            {
            }
        }
    }
}