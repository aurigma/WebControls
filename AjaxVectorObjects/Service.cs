using Aurigma.GraphicsMill.AjaxControls.VectorObjects.VirtualPath;
using System.ComponentModel;
using System.Drawing;
using System.IO;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    /// <summary>
    /// Web service which handles ajax updates for VObjects
    /// </summary>
    /// <remarks>
    /// While renaming the class, do not forget to rename it in the Resources/Service.asmx
    /// </remarks>
    [WebService(Namespace = "Aurigma.GraphicsMill.AjaxControls.VectorObjects")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [ToolboxItem(false)]
    [ScriptService]
    public class Service : WebService
    {
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string UpdateByBoundedTextVObjectData(string canvasData, string vObjectData)
        {
            var boundedText = new BoundedTextVObject { Data = vObjectData };

            using (var canvas = new CanvasSlim { Data = canvasData })
            {
                UpdateTextVObject(boundedText, canvas);
                return boundedText.Data;
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string UpdateByAutoScaledTextVObjectData(string canvasData, string vObjectData)
        {
            var autoScaledTextVObject = new AutoScaledTextVObject { Data = vObjectData };

            using (var canvas = new CanvasSlim { Data = canvasData })
            {
                UpdateTextVObject(autoScaledTextVObject, canvas);
                return autoScaledTextVObject.Data;
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string UpdateByCurvedTextVObjectData(string canvasData, string vObjectData)
        {
            var curvedText = new CurvedTextVObject { Data = vObjectData };

            using (var canvas = new CanvasSlim { Data = canvasData })
            {
                UpdateTextVObject(curvedText, canvas);
                return curvedText.Data;
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string UpdateByPlainTextVObjectData(string canvasData, string vObjectData)
        {
            var plainText = new PlainTextVObject { Data = vObjectData };

            using (var canvas = new CanvasSlim { Data = canvasData })
            {
                UpdateTextVObject(plainText, canvas);
                return plainText.Data;
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string UpdateByPathBoundedTextVObjectData(string canvasData, string vObjectData)
        {
            var pathBoundedText = new PathBoundedTextVObject { Data = vObjectData };

            using (var canvas = new CanvasSlim { Data = canvasData })
            {
                UpdateTextVObject(pathBoundedText, canvas);
                return pathBoundedText.Data;
            }
        }

        private static void UpdateTextVObject(BaseTextVObject vObject, ICanvas canvas)
        {
            var layer = new Layer();
            layer.VObjects.Add(vObject);
            canvas.Layers.Add(layer);

            var colorManagement = vObject.GetColorManagement(true);
            if (colorManagement != null)
                colorManagement.InitPreviewColorMap(vObject.GetColors());

            vObject.CurrentFileId = TextRenderer.RenderToFile(vObject, canvas.ScreenXDpi * canvas.Zoom);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string UpdateByColorData(string canvasData, string colorData)
        {
            using (var canvas = new CanvasSlim { Data = canvasData })
            {
                var serializer = new JsonVOSerializer(canvas.GetColorManagement(true));
                var color = serializer.Deserialize<Color>(colorData);

                return serializer.Serialize(color);
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string UpdateByImageVObjectData(string canvasData, string vObjectData, bool actualSize, bool preserveAspectRatio, string url)
        {
            var image = new ImageVObject { Data = vObjectData };

            image.Update(actualSize, preserveAspectRatio, url);

            return image.Data;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string UpdateByShapeVObjectData(string canvasData, string vObjectData)
        {
            return new ShapeVObject { Data = vObjectData }.Data;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public NullAbleSize GetImageSize(string imageId)
        {
            if (imageId == null)
                return new NullAbleSize();

            if (!Configuration.FileCache.FileExists(imageId))
                throw new FileNotFoundException();

            Size size;
            float hres, vres;

            Common.GetImageSize(imageId, out size, out hres, out vres);

            return new NullAbleSize { Width = size.Width, Height = size.Height };
        }

        public static void RegisterService(string serviceUrl)
        {
            if (serviceUrl.StartsWith("~"))
                serviceUrl = VirtualPathUtility.ToAbsolute(serviceUrl);

            VirtualPathProvider.RegisterVirtualFile(serviceUrl, () => new ServiceVirtualFile(serviceUrl));
        }

        public class NullAbleSize
        {
            public int? Width;
            public int? Height;
        }
    }
}