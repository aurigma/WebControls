// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.Codecs;
using Aurigma.GraphicsMill.Codecs.Psd;
using Aurigma.GraphicsMill.Transforms;
using System;
using System.IO;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class ImageResizer
    {
        private readonly FileCache.IFileCache _fileCache;

        public ImageResizer() : this(null)
        {
        }

        internal ImageResizer(FileCache.IFileCache fileCache)
        {
            _fileCache = fileCache ?? Configuration.FileCache;
        }

        public string GetThumbnail(IResizeOptions options)
        {
            var fileId = options.ThumbnailId;

            if (_fileCache.FileExists(fileId))
                return fileId;

            try
            {
                _fileCache.WriteToStream(fileId, s =>
                {
                    WriteThumbnail(s, options);
                });
            }
            catch (Exception)
            {
                _fileCache.RemoveFile(fileId);
                throw;
            }

            return fileId;
        }

        internal void WriteThumbnail(Stream stream, IResizeOptions options)
        {
            if (stream == null)
                throw new ArgumentNullException("stream");

            if (options == null)
                throw new ArgumentNullException("options");

            Pipeline pipeline = null;
            try
            {
                using (var readStream = options.GetSourceImageReadStream())
                using (var reader = ImageReader.Create(readStream))
                {
                    IImageParams firstElement;
                    var psdReader = reader as PsdReader;
                    if (psdReader != null)
                    {
                        if (psdReader.MergedImageFrame == null)
                            throw new MediaUnsupportedException("Cannot read merged image frame from from PSD.");

                        firstElement = psdReader.MergedImageFrame;
                    }
                    else
                        firstElement = reader;

                    pipeline = new Pipeline((PipelineElement)firstElement);

                    if (firstElement.Width != options.Size.Width || firstElement.Height != options.Size.Height)
                        pipeline.Add(new Resize(options.Size, ResizeInterpolationMode.Anisotropic9, options.ResizeMode));

                    var cc = ColorManagement.GetColorConverter(options.ColorManagement, firstElement, options.PixelFormat, true);
                    if (cc != null)
                        pipeline.Add(cc);

                    pipeline.Add(ImageWriter.Create(stream, Common.GetWriterSettings(options.FileFormat)));
                    pipeline.Run();
                }
            }
            finally
            {
                if (pipeline != null)
                    pipeline.DisposeAllElements();
            }
        }
    }
}