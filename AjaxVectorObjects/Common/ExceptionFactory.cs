// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.Codecs;
using System;
using System.IO;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    internal static class ExceptionFactory
    {
        internal static ArgumentException ItemBelongsCollection()
        {
            return new ArgumentException(Resources.Exceptions.ItemBelongsCollection);
        }

        internal static ArgumentException CanvasInLayerCollectionIsNull()
        {
            return new ArgumentNullException("canvas");
        }

        internal static ArgumentNullException LayerInObjectCollectionIsNull()
        {
            return new ArgumentNullException("layer");
        }

        internal static ArgumentOutOfRangeException VObjectOutOfRange(int index)
        {
            return new ArgumentOutOfRangeException("index", index, string.Format(Resources.Exceptions.VObjectOutOfRange, index));
        }

        internal static ArgumentOutOfRangeException LayerOutOfRange(int index)
        {
            return new ArgumentOutOfRangeException("index", index, string.Format(Resources.Exceptions.LayerOutOfRange, index));
        }

        internal static NotSupportedException CollectionSetterNotSupported()
        {
            return new NotSupportedException(Resources.Exceptions.ReadOnlyCollection);
        }

        internal static MediaUnsupportedException MediaUnsupported()
        {
            return new MediaUnsupportedException();
        }

        internal static System.Net.WebException BadRequest(string url, System.Exception ex)
        {
            return new System.Net.WebException(string.Format(Resources.Exceptions.BadRequest, url), ex);
        }

        internal static InvalidOperationException SourceFormat(System.Exception ex)
        {
            return ex == null ? new InvalidOperationException(Resources.Exceptions.SourceFormat) :
                new InvalidOperationException(Resources.Exceptions.SourceFormat, ex);
        }

        internal static System.ApplicationException DownloadDeny()
        {
            return new ApplicationException(Resources.Exceptions.DownloadDeny);
        }

        internal static FileNotFoundException ImageFileNotFound(string fileName)
        {
            return new FileNotFoundException(Resources.Exceptions.ImageFileNotFound, fileName);
        }

        internal static ApplicationException CanNotDownloadImage(System.Exception innerException)
        {
            return new ApplicationException(Resources.Exceptions.CanNotDownloadImage, innerException);
        }

        internal static InvalidOperationException CanNotDrawImageByUrl()
        {
            return new InvalidOperationException(Resources.Exceptions.CanNotDrawImageByUrl);
        }

        internal static NotSupportedException NotSupportedException()
        {
            return new NotSupportedException();
        }

        internal static ArgumentNullException ArgumentNullException()
        {
            return new ArgumentNullException();
        }

        internal static ArgumentOutOfRangeException ArgumentOutOfRangeException(string paramName)
        {
            return new ArgumentOutOfRangeException(paramName);
        }
    }
}