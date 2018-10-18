// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileCache;
using Aurigma.GraphicsMill.Codecs;
using System;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Text;
using SMath = System.Math;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class ResizeOptions : IResizeOptions, IDisposable
    {
        private const FileFormat _defaultFileFormat = FileFormat.Png;
        private const ColorSpace _defaultColorSpace = ColorSpace.Rgb;

        private readonly IImageSource _source;

        public ColorManagement ColorManagement { get; private set; }
        public Size Size { get; private set; }
        public FileFormat FileFormat { get; private set; }
        public PixelFormat PixelFormat { get; private set; }
        public Transforms.ResizeMode ResizeMode { get; private set; }
        public string ThumbnailId { get; private set; }

        public ResizeOptions(string sourceImageId, Size size, ColorManagement colorManagement = null, bool isSquare = false, bool keepProportions = false)
            : this(new ImageSource(sourceImageId), size, null, colorManagement, isSquare, keepProportions)
        {
        }

        public ResizeOptions(FileInfo sourceImageFile, Size size, string thumbnailId, ColorManagement colorManagement = null, bool isSquare = false, bool keepProportions = false)
            : this(new ImageSource(sourceImageFile), size, thumbnailId, colorManagement, isSquare, keepProportions)
        {
        }

        internal ResizeOptions(IImageSource source, Size size, string thumbnailId = null, ColorManagement colorManagement = null, bool isSquare = false, bool keepProportions = false)
        {
            _source = source;

            if (size.IsEmpty)
                throw new ArgumentException(@"Size cannot be empty", "size");

            if (size.Width < 0 || size.Height < 0)
                throw new ArgumentOutOfRangeException("size");

            var sourceParams = source.Params;
            if (sourceParams.FileFormat == FileFormat.Unknown)
                throw new MediaUnsupportedException();

            ColorManagement = colorManagement;

            Size = new Size(SMath.Min(size.Width, sourceParams.Width), SMath.Min(size.Height, sourceParams.Height));

            FileFormat = sourceParams.FileFormat == FileFormat.Jpeg ? FileFormat.Jpeg : _defaultFileFormat;

            PixelFormat = ColorManagement.GetPixelFormat(_defaultColorSpace, FileFormat != FileFormat.Jpeg);

            ResizeMode = isSquare ? Transforms.ResizeMode.ImageFill : keepProportions ? Transforms.ResizeMode.Shrink : Transforms.ResizeMode.Resize;

            ThumbnailId = GenerateThumbnailId(thumbnailId);
        }

        public void Dispose()
        {
            if (ColorManagement != null)
                ColorManagement.Dispose();
        }

        public Stream GetSourceImageReadStream()
        {
            return _source.GetReadStream();
        }

        private string GenerateThumbnailId(string thumbnailId = null)
        {
            var ext = Common.GetImageExtension(FileFormat);
            if (ext == null)
                throw new MediaUnsupportedException(string.Format("FileFormat: {0}", FileFormat));

            string id;
            if (!string.IsNullOrEmpty(thumbnailId))
            {
                id = thumbnailId;
            }
            else
            {
                var fileName = new StringBuilder(Path.GetFileNameWithoutExtension(_source.Name));
                var ci = CultureInfo.InvariantCulture;
                fileName.Append("[");
                fileName.Append(Size.Width.ToString(ci));
                fileName.Append("x");
                fileName.Append(Size.Height.ToString(ci));

                if (ColorManagement != null)
                {
                    fileName.Append(",cm(");
                    var sourceProfile = ColorManagement.GetProfile(ColorManagement, _source.Params.PixelFormat.ColorSpace);
                    if (sourceProfile != null)
                        fileName.Append(AjaxControls.Common.CalculateMD5(Encoding.UTF8.GetBytes(sourceProfile.Description)));

                    var targetProfile = ColorManagement.GetTargetProfile(ColorManagement);
                    if (targetProfile != null)
                    {
                        fileName.Append(",");
                        fileName.Append(AjaxControls.Common.CalculateMD5(Encoding.UTF8.GetBytes(targetProfile.Description)));
                    }

                    fileName.Append(")");
                }

                if (ResizeMode != Transforms.ResizeMode.Resize)
                {
                    fileName.Append(",");
                    fileName.Append(ResizeMode);
                }

                fileName.Append("]");

                id = fileName.ToString().ToLowerInvariant();
            }

            return string.Format("{0}.{1}", id, ext);
        }

        internal interface IImageSource
        {
            string Name { get; }
            ISourceImageParams Params { get; }

            Stream GetReadStream();
        }

        internal class ImageSource : IImageSource
        {
            private readonly string _fileId;
            private readonly FileInfo _fileInfo;

            public ImageSource(string fileId)
            {
                if (fileId == null)
                    throw new ArgumentNullException("fileId");

                if (!Configuration.FileCache.FileExists(fileId))
                    throw new FileNotFoundException(string.Format("Cannot find file with id {0}.", fileId));

                _fileId = fileId;
            }

            public ImageSource(FileInfo fileInfo)
            {
                if (fileInfo == null)
                    throw new ArgumentNullException("fileInfo");

                if (!fileInfo.Exists)
                    throw new FileNotFoundException(string.Format("Cannot find file {0}.", fileInfo.FullName));

                _fileInfo = fileInfo;
            }

            public string Name
            {
                get
                {
                    if (_fileId != null)
                        return _fileId;

                    if (_fileInfo != null)
                        return _fileInfo.Name;

                    throw new InvalidOperationException("Invalid image source type.");
                }
            }

            private SourceImageParams _params;

            public ISourceImageParams Params
            {
                get
                {
                    if (_params != null)
                        return _params;

                    if (_fileId != null)
                    {
                        _params = Configuration.FileCache.GetSourceImageParams(_fileId);
                    }
                    else if (_fileInfo != null)
                    {
                        using (var reader = ImageReader.Create(_fileInfo.FullName))
                        {
                            _params = new SourceImageParams(reader);
                        }
                    }
                    else
                        throw new InvalidOperationException("Invalid image source type.");

                    return _params;
                }
            }

            public Stream GetReadStream()
            {
                if (_fileId != null)
                    return Configuration.FileCache.GetReadStream(_fileId, true);

                if (_fileInfo != null)
                    return _fileInfo.OpenRead();

                throw new InvalidOperationException("Invalid image source type.");
            }
        }
    }
}