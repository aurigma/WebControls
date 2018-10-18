// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.IO;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public static class Renderer
    {
        /// <summary>
        /// Render serialized state to bitmap
        /// </summary>
        /// <param name="fileName">SVG serialized canvas state</param>
        /// <param name="dpi">dpi</param>
        /// <param name="colorSpace">Color space</param>
        /// <param name="background">Background color</param>
        /// <returns>Rendered bitmap</returns>
        public static Bitmap Render(string fileName,
            float dpi = 300,
            ColorSpace colorSpace = ColorSpace.Rgb,
            Color background = default(Color))
        {
            using (var canvas = new CanvasSlim())
                return Render(fileName, new SvgSerializer(), canvas, dpi, colorSpace, background);
        }

        /// <summary>
        /// Render serialized canvas state
        /// </summary>
        /// <param name="fileName">State file</param>
        /// <param name="serializer">Serializer to deserialize canvas state</param>
        /// <param name="canvas">ICanvas object</param>
        /// <param name="dpi">dpi</param>
        /// <param name="colorSpace">color space</param>
        /// <param name="background">background color</param>
        /// <returns>Rendered bitmap</returns>
        internal static Bitmap Render(string fileName, ISerializer serializer, ICanvas canvas,
            float dpi, ColorSpace colorSpace, Color background)
        {
            if (string.IsNullOrEmpty(fileName))
            {
                throw new ArgumentNullException("fileName");
            }

            if (!File.Exists(fileName))
            {
                throw new FileNotFoundException(string.Format("File {0} not found.", fileName), fileName);
            }

            if (dpi <= 0)
            {
                throw new ArgumentOutOfRangeException("dpi", dpi, Resources.Exceptions.DpiOutOfRange);
            }

            if (canvas == null)
            {
                canvas = new CanvasSlim();
            }

            if (serializer == null)
            {
                serializer = new SvgSerializer();
            }

            using (var fs = File.OpenRead(fileName))
            {
                serializer.Deserialize(fs, canvas);
            }

            return canvas.RenderWorkspace(dpi, colorSpace, background);
        }
    }
}