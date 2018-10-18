// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.IO;
using System.Linq;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public abstract class BaseArchive : ISerializableStorage, IDisposable
    {
        public void AddFileWithId(string fileId, string filePath, bool isSource = false)
        {
            using (var fileStream = File.OpenRead(filePath))
                AddFileWithId(fileId, fileStream, isSource);
        }

        public abstract void AddFileWithId(string fileId, Stream fileData, bool isSource = false);

        public abstract Stream GetReadStream(string fileId, bool isSource = false);

        public abstract bool FileExists(string fileId);

        public abstract void WriteToStream(string fileId, Action<Stream> action);

        public abstract void Dispose();

        public static BaseArchive CreateArchive(Stream stream)
        {
            return !IsZip(stream)
                ? new TarArchive(stream, TarArchive.Mode.Read) as BaseArchive
                : new ZipArchive(stream, FileMode.Open, FileAccess.Read);
        }

        private static bool IsZip(Stream stream)
        {
            if (!stream.CanSeek)
                throw new ArgumentException("stream should be seekable");

            var initialPosition = stream.Position;

            var zipHeaderBytes = new byte[] { 0x50, 0x4b, 0x03, 0x04 };

            var isZip = zipHeaderBytes.All(headerByte => stream.ReadByte() == headerByte);

            stream.Position = initialPosition;

            return isZip;
        }
    }
}