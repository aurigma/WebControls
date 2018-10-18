// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.IO;
using System.IO.Packaging;
using System.Net.Mime;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class ZipArchive : BaseArchive
    {
        private readonly Package _zipPackage;

        public CompressionOption Compression = CompressionOption.NotCompressed;

        public ZipArchive(Stream zipStream, FileMode mode, FileAccess access)
        {
            _zipPackage = Package.Open(zipStream, mode, access);
        }

        public override void AddFileWithId(string fileId, Stream fileData, bool isSource = false)
        {
            var partUri = CreateUri(fileId);

            if (_zipPackage.PartExists(partUri))
                _zipPackage.DeletePart(partUri);

            var part = _zipPackage.CreatePart(partUri, MediaTypeNames.Application.Octet, Compression);

            using (var writeStream = part.GetStream())
                Common.CopyStream(fileData, writeStream);
        }

        public override Stream GetReadStream(string fileId, bool isSource = false)
        {
            var partUri = CreateUri(fileId);

            return _zipPackage.PartExists(partUri) ? _zipPackage.GetPart(partUri).GetStream() : null;
        }

        public override bool FileExists(string fileId)
        {
            return _zipPackage.PartExists(CreateUri(fileId));
        }

        private Stream GetWriteStream(string fileId)
        {
            var partUri = CreateUri(fileId);

            var part = _zipPackage.CreatePart(partUri, MediaTypeNames.Application.Octet, CompressionOption.NotCompressed);

            return part.GetStream();
        }

        public override void WriteToStream(string fileId, Action<Stream> action)
        {
            using (var stream = GetWriteStream(fileId))
            {
                action(stream);
            }
        }

        public override void Dispose()
        {
            var disposable = _zipPackage as IDisposable;

            disposable.Dispose();
        }

        private static Uri CreateUri(string fileId)
        {
            return PackUriHelper.CreatePartUri(new Uri(fileId, UriKind.Relative));
        }
    }
}