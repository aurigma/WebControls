// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.VirtualPath;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Web;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    /// <remarks>
    /// While renaming the class, do not forget to rename it in the Resources/Handler.ashx
    /// </remarks>
    public class Handler : IHttpHandler
    {
        private static readonly Dictionary<string, DateTime> _filesLastModifed = new Dictionary<string, DateTime>();

        private readonly FileCache.FileCache _fileCache = Configuration.FileCache;

        public bool IsReusable
        {
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            ProcessRequest(new HttpContextWrapper(context));
        }

        public void ProcessRequest(HttpContextBase context)
        {
            var pathInfo = context.Request.PathInfo;

            if (string.IsNullOrEmpty(pathInfo))
                return;

            pathInfo = pathInfo.ToLower();

            switch (pathInfo)
            {
                case "/txt":
                    ReturnTextImage(context);
                    break;

                case "/img":
                    ReturnResizedImage(context);
                    break;

                default:
                    ReturnNotFound(context);
                    break;
            }
        }

        private void ReturnTextImage(HttpContextBase context)
        {
            var textImageFileId = context.Request["f"];

            ReturnFile(context, textImageFileId, "image/png");
        }

        private void ReturnResizedImage(HttpContextBase context)
        {
            try
            {
                using (var resizeOptions = ParseResizeOptions(context))
                {
                    var thumbnailFileId = new ImageResizer().GetThumbnail(resizeOptions);

                    ReturnFile(context, thumbnailFileId, Common.GetImageMimeType(resizeOptions.FileFormat));
                }
            }
            catch (Exception)
            {
                ReturnNotFound(context);
            }
        }

        private ResizeOptions ParseResizeOptions(HttpContextBase context)
        {
            var request = context.Request;
            var fileId = request["f"];

            if (request.Params.Count == 0 || string.IsNullOrEmpty(fileId) || !_fileCache.FileExists(fileId))
                throw new InvalidOperationException();

            int width;
            if (!int.TryParse(request["w"], out width))
                width = 0;

            int height;
            if (!int.TryParse(request["h"], out height))
                height = 0;

            ColorManagement cm = null;
            var cmykProfileId = request["cmyk"];
            var rgbProfileId = request["rgb"];
            var grayscaleProfileId = request["grayscale"];
            if (!string.IsNullOrEmpty(cmykProfileId) && !string.IsNullOrEmpty(rgbProfileId) && !string.IsNullOrEmpty(grayscaleProfileId))
            {
                cm = new ColorManagement
                {
                    CmykColorProfileFileId = cmykProfileId,
                    RgbColorProfileFileId = rgbProfileId,
                    GrayscaleColorProfileFileId = grayscaleProfileId
                };

                ColorSpace colorSpace;
                if (Common.TryParseEnum(request["target"], out colorSpace) && colorSpace != ColorSpace.Unknown)
                    cm.TargetColorSpace = colorSpace;
            }

            bool squared;
            if (!bool.TryParse(request["sq"], out squared))
                squared = false;

            return new ResizeOptions(fileId, new Size(width, height), cm, squared);
        }

        private static void ReturnNotModified(HttpContextBase context)
        {
            context.Response.StatusCode = 304;
            context.Response.SuppressContent = true;
        }

        private static void ReturnNotFound(HttpContextBase context)
        {
            context.Response.StatusCode = 404;
        }

        private static bool IsClientCached(HttpContextBase context, string fileId)
        {
            var request = context.Request;
            var header = request.Headers["If-Modified-Since"];
            DateTime isModifiedSince;

            if (header != null && DateTime.TryParse(header, out isModifiedSince))
            {
                DateTime? lastModifed = null;

                lock (_filesLastModifed)
                    if (_filesLastModifed.ContainsKey(fileId))
                        lastModifed = _filesLastModifed[fileId];

                if (lastModifed.HasValue)
                    return lastModifed <= isModifiedSince.ToUniversalTime();
            }

            return false;
        }

        private void ReturnFile(HttpContextBase context, string fileId, string mimeType)
        {
            if (string.IsNullOrEmpty(fileId) || !_fileCache.FileExists(fileId))
            {
                ReturnNotFound(context);
            }
            else if (IsClientCached(context, fileId))
            {
                ReturnNotModified(context);
            }
            else
            {
                var lastModifed = DateTime.Now;

                lock (_filesLastModifed)
                    _filesLastModifed[fileId] = lastModifed;

                var response = context.Response;
                response.Cache.SetLastModified(lastModifed);
                response.Cache.SetExpires(DateTime.UtcNow.AddHours(12));
                response.Cache.SetMaxAge(new TimeSpan(0, 12, 0, 0));
                response.Cache.SetCacheability(HttpCacheability.Public);
                response.ContentType = mimeType ?? "application/octet-stream";

                using (var fileStream = _fileCache.GetReadStream(fileId))
                {
                    if (fileStream != null)
                        Common.CopyStream(fileStream, response.OutputStream);
                }
            }
        }

        public static void RegisterHandler(string handlerUrl)
        {
            if (handlerUrl.StartsWith("~"))
            {
                handlerUrl = VirtualPathUtility.ToAbsolute(handlerUrl);
            }
            VirtualPathProvider.RegisterVirtualFile(handlerUrl,
                () => new HandlerVirtualFile(handlerUrl));
        }
    }
}