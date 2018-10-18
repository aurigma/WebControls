// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Resources;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg;
using Aurigma.GraphicsMill.Codecs;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.HtmlControls;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    [ToolboxData("<{0}:Canvas runat=server></{0}:Canvas>")]
    [ParseChildren(true)]
    public partial class Canvas : HtmlControl, ICanvas, IScriptControl, IPostBackDataHandler, ICallBackDataHandler, ICallbackEventHandler
    {
        #region Private variables

        private ScriptManager _scriptManager;
        private float _zoom = 1.0F;
        private bool _initialized = true;
        private CanvasClientSideOptions _canvasClientSideOptions;
        private string _loadingImageUrl;
        private string _stateFieldId;

        private Exception _callbackException;

        private readonly ISerializer _serializer = new SvgSerializer();
        private readonly JsonVOSerializer _jsonSerializer = new JsonVOSerializer();

        #endregion Private variables

        #region Constructors

        public Canvas()
            : base("canvas")
        {
            MaxJsonLength = 10000000;

            History = new History(this);

            ReturnValue = null;
            WorkspaceHeight = 72F;
            WorkspaceWidth = 72F;
            IsSquaredBackground = true;
            MarginColor = new RgbColor(0, 0, 0, 255);
            MarginWidth = 0F;
            Margin = UnitConverter.ConvertUnitsToUnits(300.0F, 0.25F, Unit.Inch, Unit.Point);
            ConstrainedMarginEnabled = false;

            SelectionColor = new RgbColor(0, 0, 255, 178);
            SelectionWidth = 2;

            ScreenXDpi = 96F;
            ScreenYDpi = 96F;

            RotationGripSize = 8;
            RotationGripColor = new RgbColor(0, 0, 255, 51);
            RotationGripLineLength = 12;
            RotationGripLineColor = new RgbColor(0x70, 0x70, 0x70, 0xFF);

            ResizeGripSize = 8;
            ResizeGripColor = new RgbColor(255, 255, 255, 255);
            ResizeGripLineColor = new RgbColor(0xFF, 0x0, 0x0, 0xFF);

            SelectButtonTitle = "Select image";
            EditButtonTitle = "Edit";
            DoneButtonTitle = "Done";

            Tags = new Dictionary<string, object>();

            Layers = new LayerCollection(this);
            SwitchCollectionTracking(Layers, true);

            MultipleSelectionEnabled = false;
            MouseMoveTimeout = 100;
        }

        #endregion Constructors

        public bool ExcludeScripts;

        public int MaxJsonLength { get; set; }

        private string GetStateFieldId()
        {
            if (string.IsNullOrEmpty(_stateFieldId))
                _stateFieldId = ClientID + "_state";
            return _stateFieldId;
        }

        private void LayerCollection_ItemMoved(object sender, ItemMovedEventArgs<Layer> e)
        {
            var newIndex = e.NewIndex;
            var oldIndex = e.OldIndex;
            var layer = e.Item;

            if (History.TrackingEnabled)
            {
                History.AddLayerMoved(layer, oldIndex, newIndex);
            }
        }

        private void LayerCollection_ItemRemoved(object sender, ItemRemovedEventArgs<Layer> e)
        {
            var index = e.Index;
            var layer = e.Item;

            if (History.TrackingEnabled)
            {
                History.AddLayerRemoved(layer, index);
            }

            // do not call while deserialization
            if (IsInitialized)
                layer.OnRemovedFromCanvas(this);

            SwitchCollectionTracking(layer.VObjects, false);
        }

        private void LayerCollection_ItemAdded(object sender, ItemAddedEventArgs<Layer> e)
        {
            var layer = e.Item;
            var index = e.Index;

            if (History.TrackingEnabled)
            {
                History.AddLayerAdded(layer, index);
            }

            // not call while deserialization
            if (IsInitialized)
                layer.OnAddedOnCanvas(this);

            SwitchCollectionTracking(layer.VObjects, true);
        }

        private void LayerCollection_SelectedIndexChanged(object sender, SelectedIndexChangedEventArgs e)
        {
            foreach (var layer in Layers)
            {
                SwitchSelectionTracking(layer.VObjects, false);
            }

            var currentLayer = CurrentLayer;
            if (currentLayer != null)
            {
                SwitchSelectionTracking(currentLayer.VObjects, true);
            }

            // not call while deserialization
            if (IsInitialized)
                OnCurrentLayerChanged();
        }

        private void SwitchCollectionTracking(LayerCollection layerCollection, bool enable)
        {
            if (enable)
            {
                Layers.ItemAdded += LayerCollection_ItemAdded;
                Layers.ItemRemoved += LayerCollection_ItemRemoved;
                Layers.ItemMoved += LayerCollection_ItemMoved;
                Layers.SelectedIndexChanged += LayerCollection_SelectedIndexChanged;
            }
            else
            {
                Layers.ItemAdded -= LayerCollection_ItemAdded;
                Layers.ItemRemoved -= LayerCollection_ItemRemoved;
                Layers.ItemMoved -= LayerCollection_ItemMoved;
                Layers.SelectedIndexChanged -= LayerCollection_SelectedIndexChanged;
            }
        }

        private void SwitchCollectionTracking(VObjectCollection vObjectCollection, bool enable)
        {
            if (enable)
            {
                vObjectCollection.ItemAdded += VObjectCollection_ItemAdded;
                vObjectCollection.ItemMoved += VObjectCollection_ItemMoved;
                vObjectCollection.ItemRemoved += VObjectCollection_ItemRemoved;
            }
            else
            {
                vObjectCollection.ItemAdded -= VObjectCollection_ItemAdded;
                vObjectCollection.ItemMoved -= VObjectCollection_ItemMoved;
                vObjectCollection.ItemRemoved -= VObjectCollection_ItemRemoved;
            }
        }

        private void SwitchSelectionTracking(VObjectCollection vObjectCollection, bool enable)
        {
            if (enable)
            {
                vObjectCollection.SelectedIndexChanged += VObjectCollection_SelectedIndexChanged;
            }
            else
            {
                vObjectCollection.SelectedIndexChanged -= VObjectCollection_SelectedIndexChanged;
            }
        }

        private void VObjectCollection_SelectedIndexChanged(object sender, SelectedIndexChangedEventArgs e)
        {
            if (CurrentLayer != null && CurrentLayer.VObjects.Equals(sender))
            {
                // not call while deserialization
                if (IsInitialized)
                    OnCurrentVObjectChanged();
            }
        }

        private void VObjectCollection_ItemRemoved(object sender, ItemRemovedEventArgs<VObject> e)
        {
            VObjectCollection collection = (VObjectCollection)sender;
            var vObjectIndex = e.Index;
            var item = e.Item;
            var layerIndex = collection.Layer.Index;

            if (History.TrackingEnabled)
                History.AddVObjectRemoved(item, vObjectIndex, layerIndex);

            // not call while deserialization
            if (IsInitialized)
                item.OnRemovedFromCanvas(this);
        }

        private void VObjectCollection_ItemMoved(object sender, ItemMovedEventArgs<VObject> e)
        {
            var collection = (VObjectCollection)sender;
            var layerIndex = collection.Layer.Index;
            var oldIndex = e.OldIndex;
            var newIndex = e.NewIndex;
            var item = e.Item;

            if (History.TrackingEnabled && layerIndex != -1)
            {
                History.AddVObjectMoved(item, oldIndex, newIndex, layerIndex);
            }
        }

        private void VObjectCollection_ItemAdded(object sender, ItemAddedEventArgs<VObject> e)
        {
            Layer layer = ((VObjectCollection)sender).Layer;
            var vObjectIndex = e.Index;
            var item = e.Item;
            var layerIndex = layer.Index;
            if (History.TrackingEnabled)
                History.AddVObjectAdded(item, vObjectIndex, layerIndex);

            // not call while deserialization
            if (IsInitialized)
                item.OnAddedOnCanvas(this);
        }

        private float MaxZoom
        {
            get
            {
                // default max int32
                const int defaultValue = 2147483647; 

                const float countOfCanvases = 4f;

                Func<float, float> getZoomForArea = area =>
                                                  (float)
                                                  System.Math.Sqrt(area /
                                                                   (float)
                                                                   (WorkspaceWidth * WorkspaceHeight * System.Math.Pow(ScreenXDpi / 72, 2)));

                HttpBrowserCapabilities browser;

                try
                {
                    browser = HttpContext.Current.Request.Browser;
                }
                catch (NullReferenceException)
                {
                    return defaultValue;
                }

                if (browser.IsMobileDevice)
                {
                    return getZoomForArea(3000000);
                }
                else
                {
                    var browserName = browser.Browser.ToLower();

                    if (browserName == "ie")
                        if (HttpContext.Current.Request.Browser.MajorVersion >= 9)
                            return System.Math.Min(8192 / (WorkspaceWidth * ScreenXDpi / 72), 8192 / (WorkspaceHeight * ScreenYDpi / 72));

                    if (browserName == "chrome" || browserName == "safari")
                    {
                        var zoomByDimension = System.Math.Min(32767 / (WorkspaceWidth * ScreenXDpi / 72), 32767 / (WorkspaceHeight * ScreenYDpi / 72));

                        return System.Math.Min(zoomByDimension, getZoomForArea((548 * 1024 * 1024) / countOfCanvases));
                    }

                    if (browserName == "firefox")
                    {
                        var zoomByDimension = System.Math.Min(32767 / (WorkspaceWidth * ScreenXDpi / 72), 32767 / (WorkspaceHeight * ScreenYDpi / 72));

                        return System.Math.Min(zoomByDimension, getZoomForArea((950 * 1024 * 1024) / countOfCanvases));
                    }
                }

                return defaultValue;
            }
        }

        /// <summary>
        /// Render canvas workspace to bitmap
        /// </summary>
        /// <param name="dpi">DPI</param>
        /// <param name="colorSpace">Color Space</param>
        /// <param name="backgroundColor">Background color for the rendered image</param>
        /// <param name="isPreview"></param>
        /// <returns>Rendered Bitmap</returns>
        public Bitmap RenderWorkspace(float dpi, ColorSpace colorSpace, Color backgroundColor = null, bool isPreview = false)
        {
            return new Renderer().Render(this, dpi, colorSpace, backgroundColor, isPreview);
        }

        /// <summary>
        /// Render canvas workspace using pipeline
        /// </summary>
        /// <param name="writer">Image writer</param>
        /// <param name="dpi">DPI of the rendered image</param>
        /// <param name="colorSpace">Color space of the rendered image</param>
        /// <param name="backgroundColor">Background color for the rendered image</param>
        /// <param name="isPreview"></param>
        public void RenderWorkspace(PipelineElement writer, float dpi, ColorSpace colorSpace, Color backgroundColor = null, bool isPreview = false)
        {
            new Renderer().Render(writer, this, dpi, colorSpace, backgroundColor, isPreview);
        }

        public void RenderWorkspaceToPdf(PdfWriter writer, float dpi, ColorSpace colorSpace, Color backgroundColor, SizeF documentSize)
        {
            new Renderer().Render(writer, this, dpi, colorSpace, backgroundColor, false, documentSize);
        }

        #region Serialization

        public void Serialize(Stream stream)
        {
            _serializer.Serialize(this, stream);
        }

        public void Deserialize(Stream stream)
        {
            _serializer.Deserialize(stream, this);
        }

        #endregion Serialization

        #region Bindable properties

        #region ColorManagement

        private readonly ColorManagement _colorManagement = new ColorManagement();

        public override void Dispose()
        {
            base.Dispose();

            _colorManagement.Dispose();
        }

        public ColorProfile RgbColorProfile
        {
            get { return _colorManagement.RgbColorProfile; }
            set { _colorManagement.RgbColorProfile = value; }
        }

        public string RgbColorProfileFileId
        {
            get { return _colorManagement.RgbColorProfileFileId; }
            set { _colorManagement.RgbColorProfileFileId = value; }
        }

        public ColorProfile CmykColorProfile
        {
            get { return _colorManagement.CmykColorProfile; }
            set { _colorManagement.CmykColorProfile = value; }
        }

        public string CmykColorProfileFileId
        {
            get { return _colorManagement.CmykColorProfileFileId; }
            set { _colorManagement.CmykColorProfileFileId = value; }
        }

        public ColorProfile GrayscaleColorProfile
        {
            get { return _colorManagement.GrayscaleColorProfile; }
            set { _colorManagement.GrayscaleColorProfile = value; }
        }

        public string GrayscaleColorProfileFileId
        {
            get { return _colorManagement.GrayscaleColorProfileFileId; }
            set { _colorManagement.GrayscaleColorProfileFileId = value; }
        }

        public bool PreviewColorManagementEnabled { get; set; }

        public bool PrintColorManagementEnabled { get; set; }

        public ColorSpace? PreviewTargetColorSpace
        {
            get { return _colorManagement.TargetColorSpace; }
            set { _colorManagement.TargetColorSpace = value; }
        }

        public ColorManagement GetColorManagement(bool isPreview)
        {
            return (isPreview && PreviewColorManagementEnabled || !isPreview && PrintColorManagementEnabled) ? _colorManagement : null;
        }

        #endregion ColorManagement

        public bool IsSquaredBackground { get; set; }

        [Bindable(true)]
        [Category("Appearance")]
        [Localizable(true)]
        [ScriptIgnore()]
        public CanvasClientSideOptions CanvasClientSideOptions
        {
            get
            {
                if (_canvasClientSideOptions == null)
                    _canvasClientSideOptions = new CanvasClientSideOptions();
                return _canvasClientSideOptions;
            }
            set
            {
                _canvasClientSideOptions = value;
            }
        }

        public string ReturnValue { get; set; }

        public float ScreenXDpi { get; set; }

        public float ScreenYDpi { get; set; }

        public float? TargetDpi { get; set; }

        private float _workspaceWidth;

        public float WorkspaceWidth
        {
            get
            {
                return _workspaceWidth;
            }

            set
            {
                _workspaceWidth = value;

                // update zoom
                Zoom = Zoom;
            }
        }

        private float _workspaceHeight;

        public float WorkspaceHeight
        {
            get
            {
                return _workspaceHeight;
            }

            set
            {
                _workspaceHeight = value;

                // update zoom
                Zoom = Zoom;
            }
        }

        public bool IsInitialized
        {
            get
            {
                return _initialized;
            }
            set
            {
                _initialized = value;
            }
        }

        public float Zoom
        {
            get
            {
                return _zoom;
            }
            set
            {
                SetZoom(value);
            }
        }

        public void SetZoom(float value, bool preventEvent = false)
        {
            var maxZoom = MaxZoom;

            if (!Utils.EqualsOfFloatNumbers(_zoom, value) || _zoom > maxZoom)
            {
                _zoom = value > maxZoom ? maxZoom : value;

                if (!preventEvent)
                    OnZoomChanged();
            }
        }

        // Rotation grip properties
        public float RotationGripSize { get; set; }

        public float RotationGripLineLength { get; set; }
        public float ResizeGripSize { get; set; }
        public RgbColor RotationGripColor { get; set; }

        // Resize grip properties
        public RgbColor ResizeGripColor { get; set; }

        public RgbColor RotationGripLineColor { get; set; }
        public RgbColor ResizeGripLineColor { get; set; }

        // Placeholder buttons
        public string SelectButtonCssClass { get; set; }

        public string EditButtonCssClass { get; set; }
        public string DoneButtonCssClass { get; set; }
        public string ButtonGroupCssClass { get; set; }
        public string SelectButtonTitle { get; set; }
        public string EditButtonTitle { get; set; }
        public string DoneButtonTitle { get; set; }

        #endregion Bindable properties

        #region Properties

        public Dictionary<string, object> Tags { get; private set; }
        public bool MultipleSelectionEnabled { get; set; }
        public int MouseMoveTimeout { get; set; }
        public bool DisableSmoothing { get; set; }

        // Margin properties
        public bool ConstrainedMarginEnabled { get; set; }

        public RgbColor MarginColor { get; set; }
        public float MarginWidth { get; set; }

        public float Margin
        {
            get { return System.Math.Min(LeftRightMargin, LeftRightMargin); }
            set
            {
                LeftRightMargin = value;
                TopBottomMargin = value;
            }
        }

        public float LeftRightMargin { get; set; }
        public float TopBottomMargin { get; set; }

        public float SelectionWidth { get; set; }
        public RgbColor SelectionColor { get; set; }

        [ScriptIgnore]
        public string LoadingImageUrl
        {
            get
            {
                if (Page != null)
                {
                    if (string.IsNullOrEmpty(_loadingImageUrl))
                    {
                        _loadingImageUrl = Page.ClientScript.GetWebResourceUrl(GetType(), "Aurigma.GraphicsMill.AjaxControls.VectorObjects.Resources.WaitClock.gif");
                    }
                    return Page.ResolveClientUrl(_loadingImageUrl);
                }
                else
                {
                    return _loadingImageUrl;
                }
            }
            set
            {
                _loadingImageUrl = value;
            }
        }

        [Bindable(true)]
        [Category("Appearance")]
        [Localizable(true)]
        [ScriptIgnore()]
        public History History { get; private set; }

        [Browsable(false)]
        [ScriptIgnore()]
        public Layer CurrentLayer
        {
            get { return Layers.SelectedItem; }
        }

        [Browsable(false)]
        public int CurrentLayerIndex
        {
            get
            {
                return Layers.SelectedIndex;
            }
            set
            {
                if (value < -1 || value >= Layers.Count)
                {
                    throw ExceptionFactory.ArgumentOutOfRangeException("CurrentLayerIndex");
                }
                Layers.SelectedIndex = value;
            }
        }

        [Browsable(false)]
        [ScriptIgnore()]
        public VObject CurrentVObject
        {
            get
            {
                var currentLayer = CurrentLayer;
                if (currentLayer != null)
                {
                    return currentLayer.VObjects.SelectedItem;
                }
                else
                {
                    return null;
                }
            }
        }

        [Browsable(false)]
        public int CurrentVObjectIndex
        {
            get
            {
                var currentLayer = CurrentLayer;
                if (currentLayer != null)
                {
                    return currentLayer.VObjects.SelectedIndex;
                }
                else
                {
                    return -1;
                }
            }
            set
            {
                var currentLayer = CurrentLayer;
                if (currentLayer == null && value != -1 || value < -1 ||
                        currentLayer != null && value >= currentLayer.VObjects.Count)
                    throw ExceptionFactory.ArgumentOutOfRangeException("CurrentVObjectIndex");

                if (currentLayer != null)
                {
                    currentLayer.VObjects.SelectedIndex = value;
                }
            }
        }

        public LayerCollection Layers { get; private set; }

        [ScriptIgnore()]
        public string Data
        {
            get
            {
                var colorManagement = GetColorManagement(true);
                if (colorManagement != null)
                    colorManagement.InitPreviewColorMap(GetColors());

                _jsonSerializer.ColorManagement = colorManagement;

                return _jsonSerializer.Serialize(new CanvasData(this));
            }
            set
            {
                if (!string.IsNullOrEmpty(value))
                {
                    var d = _jsonSerializer.Deserialize<CanvasData>(value);
                    d.ApplyState(this);
                }
            }
        }

        public IEnumerable<Color> GetColors()
        {
            return from layer in Layers from vObject in layer.VObjects from color in vObject.GetColors() select color;
        }

        public void Clear()
        {
            Layers.Clear();
            CurrentLayerIndex = -1;
        }

        #endregion Properties

        #region Events

        [Browsable(true)]
        public event EventHandler ZoomChanged;

        public virtual void OnZoomChanged()
        {
            if (ZoomChanged != null)
            {
                ZoomChanged(this, EventArgs.Empty);
            }
        }

        [Browsable(true)]
        public event EventHandler CurrentVObjectChanged;

        public virtual void OnCurrentVObjectChanged()
        {
            var handler = CurrentVObjectChanged;
            if (handler != null)
            {
                handler(this, EventArgs.Empty);
            }
        }

        [Browsable(true)]
        public event EventHandler CurrentLayerChanged;

        protected virtual void OnCurrentLayerChanged()
        {
            var handler = CurrentLayerChanged;
            if (handler != null)
            {
                handler(this, EventArgs.Empty);
            }
        }

        #endregion Events

        #region IScriptControl Members

        protected virtual IEnumerable<ScriptDescriptor> GetScriptDescriptors()
        {
            var scd = new ScriptComponentDescriptor(GetType().FullName);
            scd.ID = ClientID;
            scd.AddProperty("_id", ClientID);
            scd.AddProperty("_hiddenFieldID", GetStateFieldId());
            scd.AddProperty("_backgroundImage", Page.Server.HtmlEncode(Page.ClientScript.GetWebResourceUrl(GetType(), "Aurigma.GraphicsMill.AjaxControls.VectorObjects.Resources.Background.gif")));
            if (string.IsNullOrEmpty(_loadingImageUrl))
            {
                // Default image
                _loadingImageUrl = Page.ClientScript.GetWebResourceUrl(GetType(), "Aurigma.GraphicsMill.AjaxControls.VectorObjects.Resources.WaitClock.gif");
            }
            scd.AddProperty("_loadingImageUrl", Page.Server.HtmlEncode(ResolveClientUrl(LoadingImageUrl)));
            scd.AddProperty("data", Data);
            scd.AddScriptProperty("_callback", "function(){"
                + Page.ClientScript.GetCallbackEventReference(this, "this._callbackArgs"
                    , "Function.createDelegate(this, this._callbackSuccess)"
                    , "this._callbackContext"
                    , "Function.createDelegate(this, this._callbackError)", true) + "}");
            scd.AddProperty("_handlerUrl", VirtualPathUtility.ToAbsolute(Configuration.Instance.HandlerUrl));

            return new ScriptDescriptor[] { scd };
        }

        protected virtual IEnumerable<ScriptReference> GetScriptReferences()
        {
            var references = new List<ScriptReference>();

            if (!ExcludeScripts)
            {
                var scripts = new[]
                {
                    "base64.js",
                    "svg.js",
                    "VectorObjects.js"
                };

                var assembly = typeof(Canvas).Assembly;

                references.AddRange(scripts.Select(script => new ScriptReference
                {
                    Assembly = assembly.FullName,
                    Name = assembly.GetName().Name + ".Resources." + script
                }));
            }

            return references;
        }

        IEnumerable<ScriptDescriptor> IScriptControl.GetScriptDescriptors()
        {
            return GetScriptDescriptors();
        }

        IEnumerable<ScriptReference> IScriptControl.GetScriptReferences()
        {
            return GetScriptReferences();
        }

        #endregion IScriptControl Members

        #region Render

        protected override void OnPreRender(EventArgs e)
        {
            if (!DesignMode)
            {
                // Test for ScriptManager and register if it exists
                _scriptManager = ScriptManager.GetCurrent(Page);

                if (_scriptManager == null)
                    throw new HttpException(Exceptions.ScriptManagerControlRequired);

                _scriptManager.RegisterScriptControl(this);

                _scriptManager.Services.Add(new ServiceReference(Configuration.Instance.ServiceUrl));
            }

            Page.ClientScript.RegisterOnSubmitStatement(typeof(Canvas), GetStateFieldId(), " $find(\"" + ClientID + "\")._saveState();");
            Page.RegisterRequiresPostBack(this);

            base.OnPreRender(e);
        }

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            if (!DesignMode)
            {
                Page.ClientScript.RegisterHiddenField(GetStateFieldId(), Page.Request[GetStateFieldId()] ?? string.Empty);
                Page.RegisterRequiresPostBack(this);
            }
        }

        protected override void Render(HtmlTextWriter writer)
        {
            if (!DesignMode)
            {
                _scriptManager.RegisterScriptDescriptors(this);
                Page.ClientScript.RegisterForEventValidation(GetStateFieldId());
            }
            writer.WriteBeginTag(TagName);
            RenderAttributes(writer);
            writer.Write(HtmlTextWriter.TagRightChar);
            writer.WriteEndTag(TagName);
        }

        #endregion Render

        #region IPostBackDataHandler Members

        public bool LoadPostData(string postDataKey, NameValueCollection postCollection)
        {
            Data = postCollection[GetStateFieldId()];
            return true;
        }

        public void RaisePostDataChangedEvent()
        { }

        #endregion IPostBackDataHandler Members

        #region ICallBackDataHandler Members

        string ICallBackDataHandler.GetCallBackExecutionCode()
        {
            var serializer = new JavaScriptSerializer();
            var st = serializer.Serialize(Data);
            return "$find(\"" + ClientID + "\").set_data(" + st + ");";
        }

        #endregion ICallBackDataHandler Members

        #region ICallbackEventHandler Members

        private string GetCallBackExecutionCodes(Control cl)
        {
            var result = "";

            var handler = cl as ICallBackDataHandler;
            if (handler != null)
            {
                result += handler.GetCallBackExecutionCode();
            }

            for (var i = 0; i < cl.Controls.Count; i++)
            {
                result += GetCallBackExecutionCodes(cl.Controls[i]);
            }

            return result;
        }

        public string GetCallbackResult()
        {
            if (_callbackException == null)
                return GetCallBackExecutionCodes(Page);
            else
                throw _callbackException;
        }

        public void RaiseCallbackEvent(string eventArgument)
        {
            try
            {
                var jss = new JavaScriptSerializer();
                jss.MaxJsonLength = MaxJsonLength;
                var callbackCollection = (object[])(jss.DeserializeObject(eventArgument));

                for (var i = 0; i < callbackCollection.Length; i++)
                {
                    var callbackArgs = (object[])(jss.DeserializeObject((string)callbackCollection[i]));

                    var eventName = (string)(callbackArgs[0]);
                    var functionName = (string)(callbackArgs[1]);
                    var objectName = (string)(callbackArgs[2]);
                    var layerIndex = (int)(callbackArgs[3]);
                    var vObjectIndex = (int)(callbackArgs[4]);
                    var args = (object[])(callbackArgs[5]);

                    // Invoke Event.
                    if (objectName == "object")
                    {
                    }
                    else if (objectName == "canvas")
                    {
                    }
                    else if (objectName == "layer")
                    {
                    }
                    else if (objectName == null)
                    {
                        MethodInfo methodInfo = null;
                        Control methodContainer = null;

                        // Seek method to invoke in all parents, not only Page and immediate parent.
                        Control c = this;
                        var res = false;
                        while (c != null)
                        {
                            res = IsValidMethod(c, functionName, out methodInfo);
                            if (res)
                            {
                                break;
                            }
                            c = c.Parent;
                        }
                        methodContainer = c;
                        object returnValue = null;
                        if (methodContainer != null && methodInfo != null)
                        {
                            returnValue = BaseViewerPublic.InvokeRemoteScriptingMethod(methodContainer, functionName, args);
                        }
                        ReturnValue = jss.Serialize(returnValue);
                    }
                }
            }
            catch (Exception ex)
            {
                _callbackException = ex;
            }
        }

        private bool IsValidMethod(Object methodContainer, string functionName, out MethodInfo methodInfo)
        {
            bool res = false;
            methodInfo = null;
            if (methodContainer != null && !string.IsNullOrEmpty(functionName))
            {
                Type objectType = methodContainer.GetType();
                methodInfo = objectType.GetMethod(functionName);
                if (methodInfo != null)
                {
                    if (methodInfo.GetCustomAttributes(typeof(RemoteScriptingMethodAttribute), false).Length > 0)
                    {
                        res = true;
                    }
                    else
                    {
                        res = false;
                        methodInfo = null;
                    }
                }
            }
            return res;
        }

        #endregion ICallbackEventHandler Members
    }
}