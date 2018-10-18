// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Aurigma.GraphicsMill.AjaxControls
{
    public abstract class BaseViewer : BaseScriptControl, IPostBackDataHandler, IPostBackEventHandler, IDisposable, ICallbackEventHandler
    {
        /// <summary>
        /// Private structure for control state deserialization
        /// </summary>
        private struct BaseViewerState
        {
            public bool ClientSideOptions_PostBackOnWorkspaceChanged;
            public bool ClientSideOptions_PostBackOnWorkspaceClick;
            public Point ScrollingPosition;
            public ViewportAlignment ViewportAlignment;
            public float Zoom;
            public ZoomMode ZoomMode;
            public string Navigator;
            public string Rubberband;
            public bool WorkspaceChanged;
            public bool WorkspaceClick;
            public PointF WorkspaceClickArgs;
            public Point ScrollingSize;
            public ScrollBarsStyle ScrollBarsStyle;
            public int ScrollBarWidth;
            public bool RulerEnabled;
            public int RulerWidth;
            public float RulerScale;
            public float RulerOffsetX;
            public float RulerOffsetY;

            public static BaseViewerState Empty
            {
                get
                {
                    BaseViewerState instance;
                    instance.ClientSideOptions_PostBackOnWorkspaceChanged = false;
                    instance.ClientSideOptions_PostBackOnWorkspaceClick = false;
                    instance.ScrollingPosition = new Point(0, 0);
                    instance.ViewportAlignment = ViewportAlignment.LeftTop;
                    instance.Zoom = 1;
                    instance.ZoomMode = ZoomMode.None;
                    instance.Navigator = "";
                    instance.Rubberband = "";
                    instance.WorkspaceChanged = false;
                    instance.WorkspaceClick = false;
                    instance.WorkspaceClickArgs = new PointF(0, 0);
                    instance.ScrollingSize = new Point(0, 0);
                    instance.ScrollBarsStyle = ScrollBarsStyle.Auto;
                    instance.ScrollBarWidth = 17;

                    instance.RulerWidth = 13;
                    instance.RulerEnabled = false;
                    instance.RulerScale = 1;
                    instance.RulerOffsetX = 0;
                    instance.RulerOffsetY = 0;

                    return instance;
                }
            }
        } // struct BaseViewer.BaseViewerState

        private ViewerClientSideOptions _clientSideOptions;
        private float _maxZoom;
        private float _minZoom;
        private string _navigatorID;
        private INavigator _navigator;
        private string _rubberbandID;
        private IRubberband _rubberband;
        private float _screenXDpi;
        private float _screenYDpi;
        private ScrollBarsStyle _scrollBarsStyle;
        private int _scrollBarWidth;
        private Point _scrollingPosition;
        private ViewportAlignment _viewportAlignment;
        private JqueryMode _jqueryMode;
        private float _zoom;
        private ZoomMode _zoomMode;
        private ZoomQuality _zoomQuality;
        private Point _scrollingSize = new Point(0, 0);
        private BaseViewerState _postedState;
        private bool _isPageLoaded;
        private bool _disposed;
        private bool _rulerEnabled;
        private int _rulerWidth;
        private float _rulerScale;
        private float _rulerOffsetX;
        private float _rulerOffsetY;
        private bool _needReinit = false;

        protected BaseViewer()
            : base()
        {
            // Init inherited properties
            this.Width = 300;
            this.Height = 200;
            this.BackColor = System.Drawing.Color.White;
            this.BorderStyle = BorderStyle.Inset;
            this.BorderWidth = 2;

            _clientSideOptions = new ViewerClientSideOptions();
            _maxZoom = 16.0f;
            _minZoom = 0.001f;
            _navigatorID = "";
            _rubberbandID = "";
            _screenXDpi = 72f;
            _screenYDpi = 72f;

            _scrollBarWidth = 17;
            if (HttpContext.Current != null)
                if (HttpContext.Current.Request.Browser.IsMobileDevice)
                    _scrollBarWidth = 0;

            _scrollBarsStyle = ScrollBarsStyle.Always;
            _scrollingPosition = new Point(0, 0);
            _viewportAlignment = ViewportAlignment.LeftTop;
            _zoom = 1.0f;
            _zoomMode = ZoomMode.None;
            _zoomQuality = ZoomQuality.ShrinkHighStretchLow;
            _rulerEnabled = false;
            _rulerWidth = 13;
            _rulerScale = 1;
            _rulerOffsetX = 0;
            _rulerOffsetY = 0;
            _postedState = BaseViewerState.Empty;
            RenderState = true;
            PinchZoomEnabled = true;

            if (!ExcludeScripts)
                ScriptFiles.Add("BaseViewer");

            JqueryMode = JqueryMode.BuiltIn;
        }

        ~BaseViewer()
        {
            Dispose(false);
        }

        #region Public members

        [Browsable(true)]
        [ResDescription("BaseViewer_WorkspaceChanged")]
        public event System.EventHandler WorkspaceChanged;

        [Browsable(true)]
        [ResDescription("BaseViewer_WorkspaceClick")]
        public event EventHandler<WorkspaceClickEventArgs> WorkspaceClick;

        [Browsable(true)]
        [ResDescription("BaseViewer_ClientSideOptions")]
        [DefaultValue("")]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        [PersistenceModeAttribute(PersistenceMode.InnerProperty)]
        public ViewerClientSideOptions ClientSideOptions
        {
            get
            {
                return _clientSideOptions;
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public abstract float WorkspaceHeight { get; }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public abstract float WorkspaceWidth { get; }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public virtual Point ScrollingSize
        {
            get { return _scrollingSize; }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public virtual float ActualSizeHorizontalScale
        {
            get
            {
                return 1.0f;
            }
        }

        [Browsable(true)]
        [ResDescription("BaseViewer_MaxZoom")]
        [DefaultValue(16f)]
        public float MaxZoom
        {
            get
            {
                return _maxZoom;
            }

            set
            {
                if (value <= 0)
                {
                    throw new ArgumentOutOfRangeException("value", Resources.Messages.MaxZoomIsOutOfRange);
                }
                _maxZoom = value;
            }
        }

        [Browsable(true)]
        [ResDescription("BaseViewer_MinZoom")]
        [DefaultValue(0.1f)]
        public float MinZoom
        {
            get
            {
                return this._minZoom;
            }

            set
            {
                if (value <= 0)
                {
                    throw new ArgumentOutOfRangeException("value", Resources.Messages.MinZoomIsOutOfRange);
                }
                this._minZoom = value;
            }
        }

        [Browsable(true)]
        [DefaultValue("300px")]
        public override System.Web.UI.WebControls.Unit Width
        {
            get
            {
                return base.Width;
            }
            set
            {
                base.Width = value;
                UpdateViewport();
            }
        }

        [Browsable(true)]
        [DefaultValue("200px")]
        public override System.Web.UI.WebControls.Unit Height
        {
            get
            {
                return base.Height;
            }
            set
            {
                base.Height = value;
                UpdateViewport();
            }
        }

        [Browsable(true)]
        [DefaultValue(false)]
        public bool RulerEnabled
        {
            get
            {
                return this._rulerEnabled;
            }
            set
            {
                this._rulerEnabled = value;
                UpdateViewport();
            }
        }

        private float _bestFitWhiteSpacePc = 0;

        [Browsable(true)]
        [DefaultValue(0f)]
        public float BestFitWhiteSpacePc
        {
            get { return _bestFitWhiteSpacePc * 100f; }

            set
            {
                if (value >= 0 && value < 99)
                    this._bestFitWhiteSpacePc = value / 100f;
            }
        }

        [Browsable(true)]
        [DefaultValue(true)]
        public bool PinchZoomEnabled { get; set; }

        [Browsable(true)]
        [DefaultValue(13)]
        public int RulerWidth
        {
            get
            {
                return this._rulerWidth;
            }
            set
            {
                this._rulerWidth = value;
                UpdateViewport();
            }
        }

        [Browsable(true)]
        [DefaultValue(1)]
        public float RulerScale
        {
            get
            {
                return this._rulerScale;
            }
            set
            {
                if (value <= 0)
                {
                    throw new ArgumentOutOfRangeException("value", Resources.Messages.RulerScaleOutOfRange);
                }
                this._rulerScale = value;
                UpdateViewport();
            }
        }

        [Browsable(true)]
        [DefaultValue(0)]
        public float RulerOffsetX
        {
            get
            {
                return this._rulerOffsetX;
            }
            set
            {
                this._rulerOffsetX = value;
                UpdateViewport();
            }
        }

        [Browsable(true)]
        [DefaultValue(0)]
        public float RulerOffsetY
        {
            get
            {
                return this._rulerOffsetY;
            }
            set
            {
                this._rulerOffsetY = value;
                UpdateViewport();
            }
        }

        [Browsable(true)]
        [ResDescription("BaseViewer_Navigator")]
        [DefaultValue("")]
        [TypeConverter(typeof(NavigatorConverter))]
        public string Navigator
        {
            set
            {
                if (_navigator != null)
                {
                    _navigator.Disconnect();
                }

                _navigatorID = value;

                // Connect if page and other controls are already available
                // otherwise we will attach navigator in page load event handler
                if (this.IsPageLoaded)
                {
                    ConnectNavigator();
                }
            }

            get
            {
                return _navigatorID;
            }
        }

        [Browsable(true)]
        [ResDescription("BaseViewer_Rubberband")]
        [DefaultValue("")]
        [TypeConverter(typeof(RubberbandConverter))]
        public string Rubberband
        {
            set
            {
                if (_rubberband != null)
                {
                    _rubberband.Disconnect();
                }

                _rubberbandID = value;

                // Connect if page and other controls are already available
                // otherwise we will attach rubberband in page load event handler
                if (this.IsPageLoaded)
                {
                    ConnectRubberband();
                }
            }

            get
            {
                return _rubberbandID;
            }
        }

        [Browsable(true)]
        [ResDescription("BaseViewer_ScreenXDpi")]
        [DefaultValue(72f)]
        public virtual float ScreenXDpi
        {
            get
            {
                return _screenXDpi;
            }
            set
            {
                _screenXDpi = value;
            }
        }

        [Browsable(true)]
        [ResDescription("BaseViewer_ScreenYDpi")]
        [DefaultValue(72f)]
        public virtual float ScreenYDpi
        {
            get
            {
                return _screenYDpi;
            }
            set
            {
                _screenYDpi = value;
            }
        }

        [Browsable(true)]
        [ResDescription("BaseViewer_ScrollBarsStyle")]
        [DefaultValue(ScrollBarsStyle.Always)]
        public ScrollBarsStyle ScrollBarsStyle
        {
            get
            {
                return _scrollBarsStyle;
            }

            set
            {
                _scrollBarsStyle = value;
                this.UpdateViewport();
            }
        }

        [Browsable(true)]
        [ResDescription("BaseViewer_ScrollBarWidth")]
        [DefaultValue(17)]
        public int ScrollBarWidth
        {
            get
            {
                return _scrollBarWidth;
            }

            set
            {
                _scrollBarWidth = value;
                this.UpdateViewport();
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public System.Drawing.Point ScrollingPosition
        {
            get
            {
                return _scrollingPosition;
            }
            set
            {
                _scrollingPosition = value;
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public virtual float ActualSizeVerticalScale
        {
            get
            {
                return 1.0f;
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public abstract int ContentHeight { get; }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public abstract int ContentWidth { get; }

        [Browsable(true)]
        [DefaultValue(JqueryMode.BuiltIn)]
        public JqueryMode JqueryMode
        {
            get
            {
                return _jqueryMode;
            }

            set
            {
                // add jQuery and plugins

                if (!ExcludeScripts)
                {
                    // clean previous set
                    ScriptFiles.Remove("jquery.hammer");
                    ScriptFiles.Remove("jquery");
                    ScriptFiles.Remove("RevertJquery");

                    if (value == JqueryMode.BuiltIn)
                        ScriptFiles.Add("jquery");

                    ScriptFiles.Add("jquery.hammer");

                    if (value == JqueryMode.BuiltIn)
                        ScriptFiles.Add("RevertJquery");
                }

                _jqueryMode = value;
            }
        }

        [Browsable(true)]
        [ResDescription("BaseViewer_ViewportAlignment")]
        [DefaultValue(ViewportAlignment.LeftTop)]
        public ViewportAlignment ViewportAlignment
        {
            get
            {
                return _viewportAlignment;
            }

            set
            {
                _viewportAlignment = value;
            }
        }

        [Browsable(true)]
        [ResDescription("BaseViewer_Zoom")]
        [DefaultValue(1f)]
        virtual public float Zoom
        {
            get
            {
                return _zoom;
            }

            set
            {
                if (_zoom != value)
                {
                    _zoom = Math.Min(Math.Max(value, _minZoom), _maxZoom);

                    if (_zoomMode != ZoomMode.ZoomControl)
                        _zoomMode = ZoomMode.None;

                    UpdateViewport();
                }
            }
        }

        public override System.Web.UI.WebControls.Unit BorderWidth
        {
            get
            {
                return base.BorderWidth;
            }
            set
            {
                if (value.Type != UnitType.Pixel)
                    throw new System.FormatException(Resources.Messages.BorderWidthFormatException);
                base.BorderWidth = value;
            }
        }

        [Browsable(true)]
        [ResDescription("BaseViewer_ZoomMode")]
        [DefaultValue(ZoomMode.None)]
        virtual public ZoomMode ZoomMode
        {
            get
            {
                return _zoomMode;
            }

            set
            {
                float oldZoom = _zoom;

                _zoomMode = value;

                UpdateViewport();
            }
        }

        [Browsable(true)]
        [ResDescription("BaseViewer_ZoomQuality")]
        [DefaultValue(ZoomQuality.ShrinkHighStretchLow)]
        public ZoomQuality ZoomQuality
        {
            get
            {
                return _zoomQuality;
            }

            set
            {
                _zoomQuality = value;
            }
        }

        #region Hide properties from displaying in object browser

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public override string CssClass
        {
            get
            {
                return "";
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        public override System.Web.UI.WebControls.FontInfo Font
        {
            get
            {
                return base.Font;
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        public override System.Drawing.Color ForeColor
        {
            get
            {
                return System.Drawing.Color.Empty;
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        public override bool EnableTheming
        {
            get
            {
                return false;
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        public override string SkinID
        {
            get
            {
                return "";
            }
        }

        #endregion Hide properties from displaying in object browser

        bool IPostBackDataHandler.LoadPostData(string postDataKey, System.Collections.Specialized.NameValueCollection postCollection)
        {
            return LoadPostData(postDataKey, postCollection);
        }

        void IPostBackDataHandler.RaisePostDataChangedEvent()
        {
            RaisePostDataChangedEvent();
        }

        void IPostBackEventHandler.RaisePostBackEvent(string eventArgument)
        {
            RaisePostBackEvent(eventArgument);
        }

        string ICallbackEventHandler.GetCallbackResult()
        {
            return GetCallbackResult();
        }

        void ICallbackEventHandler.RaiseCallbackEvent(string eventArgument)
        {
            RaiseCallbackEvent(eventArgument);
        }

        public sealed override void Dispose()
        {
            if (_disposed)
                return;

            try
            {
                try
                {
                    Dispose(true);
                }
                finally
                {
                    _disposed = true;
                    System.GC.SuppressFinalize(this);
                }
            }
            finally
            {
                base.Dispose();
            }
        }

        #endregion Public members

        #region Protected members

        private void FindControlRecursive(ref Control cl, Control control, string ID)
        {
            if ((control.ID == ID) || (control.ClientID == ID))
            {
                if (cl != null)
                    throw new System.Exception("There are two controls with the same ID on the page: " + ID);
                else
                    cl = control;
            }

            for (int i = 0; i < control.Controls.Count; i++)
            {
                FindControlRecursive(ref cl, control.Controls[i], ID);
            }
        }

        protected virtual bool LoadPostData(string postDataKey, System.Collections.Specialized.NameValueCollection postCollection)
        {
            string state = postCollection[this.GetStateFieldId()];

            if (String.IsNullOrEmpty(state))
            {
                _needReinit = true;
                return false;
            }

            var jss = new System.Web.Script.Serialization.JavaScriptSerializer();

            _postedState = jss.Deserialize<BaseViewerState>(state);

            this.ClientSideOptions.PostBackOnWorkspaceChanged = _postedState.ClientSideOptions_PostBackOnWorkspaceChanged;
            this.ClientSideOptions.PostBackOnWorkspaceClick = _postedState.ClientSideOptions_PostBackOnWorkspaceClick;

            this.ScrollingPosition = _postedState.ScrollingPosition;
            this.ViewportAlignment = _postedState.ViewportAlignment;
            this.ScrollBarsStyle = _postedState.ScrollBarsStyle;
            this.ScrollBarWidth = _postedState.ScrollBarWidth;
            this.Zoom = _postedState.Zoom;
            this.ZoomMode = _postedState.ZoomMode;

            this.RulerEnabled = _postedState.RulerEnabled;
            this.RulerWidth = _postedState.RulerWidth;
            this.RulerScale = _postedState.RulerScale;
            this.RulerOffsetX = _postedState.RulerOffsetX;
            this.RulerOffsetY = _postedState.RulerOffsetY;

            _scrollingSize = _postedState.ScrollingSize;

            // Try to locate attached Navigator and Rubberband by ID or ClientID.
            // So, if _navigatorID starts with "ClientID::" this means that it's a ClientID;
            System.Globalization.NumberFormatInfo format = Common.GetNumberFormat();

            // Navigator
            if (!String.IsNullOrEmpty(_postedState.Navigator))
            {
                Control navigator = null;
                FindControlRecursive(ref navigator, this.Page.Form, _postedState.Navigator);
                if (navigator != null)
                {
                    _navigatorID = navigator.ID;
                    ConnectNavigator();
                }
                else
                {
                    throw new ControlNotFoundException(String.Format(format, Resources.Messages.CanNotLocateNavigator, _navigatorID));
                }
            }

            // Rubberband
            if (!String.IsNullOrEmpty(_postedState.Rubberband))
            {
                Control rubberband = null;
                FindControlRecursive(ref rubberband, this.Page.Form, _postedState.Rubberband);
                if (rubberband != null)
                {
                    _rubberbandID = rubberband.ID;
                    ConnectRubberband();
                }
                else
                {
                    throw new ControlNotFoundException(String.Format(format, Resources.Messages.CanNotLocateRubberband, _rubberbandID));
                }
            }

            return _postedState.WorkspaceChanged || _postedState.WorkspaceClick;
        }

        protected virtual void RaisePostDataChangedEvent()
        {
            if (_postedState.WorkspaceChanged)
            {
                OnWorkspaceChanged();
            }
            if (_postedState.WorkspaceClick)
            {
                OnWorkspaceClick();
            }
        }

        protected virtual void RaisePostBackEvent(string eventArgument)
        {
            switch (eventArgument)
            {
                case "WorkspaceChanged":
                    {
                        OnWorkspaceChanged();
                    }
                    break;

                case "WorkspaceClick":
                    {
                        OnWorkspaceClick();
                    }
                    break;
            }
        }

        protected abstract string GetCallbackResult();

        protected abstract void RaiseCallbackEvent(string eventArgument);

        protected bool IsPageLoaded
        {
            get
            {
                return _isPageLoaded;
            }
        }

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            this.Page.RegisterRequiresPostBack(this);
        }

        protected override void OnLoad(System.EventArgs e)
        {
            base.OnLoad(e);

            _isPageLoaded = true;

            this.UpdateViewport();

            if (!Page.IsPostBack || _needReinit)
            {
                if (_navigatorID.Length > 0)
                {
                    ConnectNavigator();
                }
                if (_rubberbandID.Length > 0)
                {
                    ConnectRubberband();
                }
            }
        }

        protected override void OnUnload(System.EventArgs e)
        {
            Dispose();

            base.OnUnload(e);
        }

        protected virtual void OnWorkspaceClick()
        {
            if (this.WorkspaceClick != null)
            {
                this.WorkspaceClick(this, new WorkspaceClickEventArgs(_postedState.WorkspaceClickArgs.X, _postedState.WorkspaceClickArgs.Y));
            }
        }

        protected virtual void OnWorkspaceChanged()
        {
            if (this.WorkspaceChanged != null)
            {
                this.WorkspaceChanged(this, System.EventArgs.Empty);
            }
        }

        protected override void Render(HtmlTextWriter writer)
        {
            // We need to use manual html writing as adaptive rendering cause
            // incorrect displaying in other then Interner Explorer browsers

            var cultureInfo = new System.Globalization.CultureInfo("en-us", true);

            // Render border wrapper
            writer.AddStyleAttribute(HtmlTextWriterStyle.Overflow, "hidden");
            writer.AddStyleAttribute(HtmlTextWriterStyle.Width, Width.ToString(cultureInfo));
            writer.AddStyleAttribute(HtmlTextWriterStyle.Height, Height.ToString(cultureInfo));
            writer.AddStyleAttribute(HtmlTextWriterStyle.BorderWidth, "0px");

            if (this.BorderStyle != BorderStyle.NotSet)
                writer.AddStyleAttribute(HtmlTextWriterStyle.BorderStyle, BorderStyle.ToString());

            if (this.BorderColor != System.Drawing.Color.Empty)
                writer.AddStyleAttribute(HtmlTextWriterStyle.BorderColor, ColorTranslator.ToHtml(BorderColor));

            writer.AddStyleAttribute("-webkit-user-select", "none");
            writer.AddStyleAttribute("-moz-user-select", "none");
            writer.AddStyleAttribute("user-select", "none");

            writer.RenderBeginTag(HtmlTextWriterTag.Div);

            // Render BaseViewer element
            writer.AddAttribute(HtmlTextWriterAttribute.Id, ClientID);
            writer.AddAttribute(HtmlTextWriterAttribute.Name, ClientID);

            if (!string.IsNullOrEmpty(this.CssClass))
                writer.AddAttribute(HtmlTextWriterAttribute.Class, this.CssClass);

            writer.AddStyleAttribute(HtmlTextWriterStyle.Width, "100%");
            writer.AddStyleAttribute(HtmlTextWriterStyle.Height, "100%");
            writer.AddStyleAttribute(HtmlTextWriterStyle.Display, "block");
            writer.AddStyleAttribute(HtmlTextWriterStyle.ZIndex, "1");
            if (this.Style[HtmlTextWriterStyle.Left] != null)
                writer.AddStyleAttribute(HtmlTextWriterStyle.Left, this.Style[HtmlTextWriterStyle.Left]);
            if (this.Style[HtmlTextWriterStyle.Top] != null)
                writer.AddStyleAttribute(HtmlTextWriterStyle.Top, this.Style[HtmlTextWriterStyle.Top]);
            if (this.Style[HtmlTextWriterStyle.Position] != null)
                writer.AddStyleAttribute(HtmlTextWriterStyle.Position, this.Style[HtmlTextWriterStyle.Position]);

            //--
            if (!string.IsNullOrEmpty(this.ToolTip))
                writer.AddAttribute(HtmlTextWriterAttribute.Title, this.ToolTip);

            if (!string.IsNullOrEmpty(this.AccessKey))
                writer.AddAttribute(HtmlTextWriterAttribute.Accesskey, this.AccessKey);

            writer.AddStyleAttribute(HtmlTextWriterStyle.Margin, "0");
            writer.AddStyleAttribute(HtmlTextWriterStyle.Padding, "0");
            writer.AddStyleAttribute("border", "0 none");
            writer.AddStyleAttribute(HtmlTextWriterStyle.BackgroundColor, ColorTranslator.ToHtml(this.BackColor));
            writer.AddStyleAttribute(HtmlTextWriterStyle.Position, "relative");

            if (this.DesignMode)
            {
                // writer.AddStyleAttribute(HtmlTextWriterStyle.BackgroundColor, ColorTranslator.ToHtml(this.BackColor));
                if (this.ZoomMode != ZoomMode.ZoomControl && ScrollBarsStyle == ScrollBarsStyle.Always)
                    writer.AddStyleAttribute(HtmlTextWriterStyle.Overflow, "scroll");
            }

            if (!this.DesignMode)
            {
                if (this.ScrollBarsStyle == ScrollBarsStyle.Always)
                {
                    writer.AddStyleAttribute(HtmlTextWriterStyle.Overflow, "scroll");
                    writer.AddStyleAttribute("-ms-overflow-style", "scrollbar ");
                }
                else
                {
                    writer.AddStyleAttribute(HtmlTextWriterStyle.Overflow, "auto");
                }
            }

            writer.AddStyleAttribute("-webkit-overflow-scrolling", "touch");
            writer.AddStyleAttribute("-webkit-transform", "translate3d(0, 0, 0)");
            writer.AddStyleAttribute("-moz-transform", "translate3d(0, 0, 0)");

            writer.AddStyleAttribute("-ms-touch-action", _msTouchActionInitialValue);

            writer.RenderBeginTag(HtmlTextWriterTag.Div);

            // close baseviewer tag
            writer.RenderEndTag();

            // close border wrapper tags
            writer.RenderEndTag();

            base.Render(writer);
        }

        protected override void InitScriptDescriptor(ScriptControlDescriptor descriptor)
        {
            descriptor.AddProperty("_backColor", ColorTranslator.ToHtml(this.BackColor));
            descriptor.AddProperty("_toolTip", Page.Server.HtmlEncode(ToolTip));
            descriptor.AddProperty("_accessKey", Page.Server.HtmlEncode(AccessKey));
            descriptor.AddProperty("_tabIndex", TabIndex);
            descriptor.AddProperty("_clientSideOptions$postBackOnWorkspaceChanged", _clientSideOptions.PostBackOnWorkspaceChanged);
            descriptor.AddProperty("_clientSideOptions$postBackOnWorkspaceClick", _clientSideOptions.PostBackOnWorkspaceClick);
            descriptor.AddProperty("_maxZoom", MaxZoom);
            descriptor.AddProperty("_minZoom", MinZoom);
            descriptor.AddProperty("_borderWidth", BorderWidth.Value);

            if (_rubberband != null)
            {
                descriptor.AddComponentProperty("rubberband", ((Control)_rubberband).ClientID);
            }
            else
            {
                descriptor.AddProperty("_rubberband", "");
            }

            if (_navigator != null)
            {
                descriptor.AddComponentProperty("navigator", ((Control)_navigator).ClientID);
            }
            else
            {
                descriptor.AddProperty("_navigator", "");
            }

            descriptor.AddProperty("_msTouchActionInitialValue", _msTouchActionInitialValue);
            descriptor.AddProperty("_screenXDpi", ScreenXDpi);
            descriptor.AddProperty("_screenYDpi", ScreenYDpi);
            descriptor.AddProperty("_scrollBarsStyle", ScrollBarsStyle);
            descriptor.AddProperty("_scrollBarWidth", ScrollBarWidth);
            System.Globalization.NumberFormatInfo format = Common.GetNumberFormat();
            descriptor.AddScriptProperty("_scrollingPosition", 
                "new Aurigma.GraphicsMill.PointF(" + ScrollingPosition.X.ToString(format) + "," + ScrollingPosition.Y.ToString(format) + ")");
            descriptor.AddProperty("_viewportAlignment", ViewportAlignment);
            descriptor.AddProperty("_jqueryMode", JqueryMode);
            descriptor.AddProperty("_zoom", Zoom);
            descriptor.AddProperty("_zoomQuality", ZoomQuality);
            descriptor.AddProperty("_zoomMode", ZoomMode);
            descriptor.AddProperty("_rulerEnabled", RulerEnabled);
            descriptor.AddProperty("_pinchZoomEnabled", PinchZoomEnabled);
            descriptor.AddProperty("_rulerWidth", RulerWidth);
            descriptor.AddProperty("_rulerScale", RulerScale);
            descriptor.AddProperty("_rulerOffsetX", RulerOffsetX);
            descriptor.AddProperty("_rulerOffsetY", RulerOffsetY);
            descriptor.AddProperty("_bestFitWhiteSpacePc", _bestFitWhiteSpacePc);

            descriptor.AddScriptProperty("_workspaceChangedPostBack", "function(){" + 
                Page.ClientScript.GetPostBackEventReference(this, "WorkspaceChanged") + "}");
            descriptor.AddScriptProperty("_workspaceClickPostBack", "function(){" + 
                Page.ClientScript.GetPostBackEventReference(this, "WorkspaceClick") + "}");

            descriptor.AddScriptProperty("_callback", "function(){" + 
                Page.ClientScript.GetCallbackEventReference(this, "this._callbackArgs", 
                "Function.createDelegate(this, this._callbackSuccess)", 
                "this._callbackContext", 
                "Function.createDelegate(this, this._callbackError)", true) + "}");

            descriptor.AddProperty("_stateFieldId", GetStateFieldId());

            base.InitScriptDescriptor(descriptor);
        }

        protected static object InvokeRemoteScriptingMethod(Object instance, string methodName, object[] methodArgs)
        {
            if (instance == null)
            {
                throw new RemoteScriptingNullReferenceException(String.Format(Common.GetNumberFormat(),
                    Resources.Messages.NullReferenceException, "instance", "InvokeRemoteScriptingMethod"));
            }

            if (methodName == null)
            {
                throw new RemoteScriptingNullReferenceException(String.Format(Common.GetNumberFormat(),
                    Resources.Messages.NullReferenceException, "methodName", "InvokeRemoteScriptingMethod"));
            }

            // Get type of instance
            Type objectType = instance.GetType();

            // Get specified method
            System.Reflection.MethodInfo methodInfo = objectType.GetMethod(methodName);

            if (methodInfo == null)
            {
                throw new MissingMethodException();
            }

            // Check whether method has RemoteScriptingMethodAttribute
            var attributes = methodInfo.GetCustomAttributes(typeof(RemoteScriptingMethodAttribute), false);
            if (attributes.Length == 0)
            {
                throw new MissingMethodException();
            }

            // We support methods which returns only primitive types
            var returnType = methodInfo.ReturnType;
            if (returnType != typeof(void) && returnType != typeof(System.String) && !returnType.IsValueType)
            {
                var cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                throw new RemoteScriptingTypeNotSupportedException(
                    String.Format(cultureInfo, Resources.Messages.TypeNotSupportedForMarshalling,
                    returnType.FullName));
            }

            // Get list of parameters
            System.Reflection.ParameterInfo[] parameters = methodInfo.GetParameters();

            System.Globalization.NumberFormatInfo format = Common.GetNumberFormat();

            // Length of passed parameters and actual method parameters should be the same
            int methodArgsLength;
            if (methodArgs == null)
            {
                methodArgsLength = 0;
            }
            else
            {
                methodArgsLength = methodArgs.Length;
            }

            if (methodArgsLength != parameters.Length)
            {
                var cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                throw new RemoteScriptingParameterCountException(
                    String.Format(cultureInfo, Resources.Messages.MethodRequiresParameters,
                    parameters.Length.ToString(format)));
            }

            // Create parameters value
            var parameterValues = new object[parameters.Length];

            // Run over the list of parameters
            for (var i = 0; i < parameters.Length; i++)
            {
                System.Reflection.ParameterInfo parameter = parameters[i];

                // Check whether it is Retval or Out parameter
                if (parameter.IsRetval)
                {
                    throw new RemoteScriptingTypeNotSupportedException(
                            Resources.Messages.ReturnValueParametersAreNotSupported);
                }
                if (parameter.IsOut)
                {
                    throw new RemoteScriptingTypeNotSupportedException(
                            Resources.Messages.OutputParametersAreNotSupported);
                }

                // Check parameter type
                var parameterType = parameter.ParameterType;

                if (parameterType.IsArray)
                {
                    var array = (object[])(methodArgs[i]);

                    if (parameterType == typeof(Byte[]))
                    {
                        var arrayCasted = new Byte[array.Length];
                        for (int j = 0; j < array.Length; j++)
                        {
                            arrayCasted[j] = Convert.ToByte(array[j], format);
                        }

                        parameterValues[i] = arrayCasted;
                    }
                    else if (parameterType == typeof(Int32[]))
                    {
                        var arrayCasted = new Int32[array.Length];
                        for (var j = 0; j < array.Length; j++)
                        {
                            arrayCasted[j] = Convert.ToInt32(array[j], format);
                        }

                        parameterValues[i] = arrayCasted;
                    }
                    else if (parameterType == typeof(Single[]))
                    {
                        var arrayCasted = new Single[array.Length];
                        for (var j = 0; j < array.Length; j++)
                        {
                            arrayCasted[j] = Convert.ToSingle(array[j], format);
                        }

                        parameterValues[i] = arrayCasted;
                    }
                    else if (parameterType == typeof(Double[]))
                    {
                        var arrayCasted = new Double[array.Length];
                        for (var j = 0; j < array.Length; j++)
                        {
                            arrayCasted[j] = Convert.ToDouble(array[j], format);
                        }

                        parameterValues[i] = arrayCasted;
                    }
                    else if (parameterType == typeof(Boolean[]))
                    {
                        var arrayCasted = new Boolean[array.Length];
                        for (int j = 0; j < array.Length; j++)
                        {
                            arrayCasted[j] = Convert.ToBoolean(array[j], format);
                        }

                        parameterValues[i] = arrayCasted;
                    }
                    else if (parameterType == typeof(String[]))
                    {
                        var arrayCasted = new String[array.Length];
                        for (var j = 0; j < array.Length; j++)
                        {
                            arrayCasted[j] = Convert.ToString(array[j], format);
                        }

                        parameterValues[i] = arrayCasted;
                    }
                    else
                    {
                        var cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                        throw new RemoteScriptingTypeNotSupportedException(
                            String.Format(cultureInfo, Resources.Messages.TypeNotSupportedForMarshalling,
                            parameterType.FullName + "[]"));
                    }
                }
                else if (parameterType == typeof(Byte))
                {
                    parameterValues[i] = Convert.ToByte(methodArgs[i]);
                } 
                else if (parameterType == typeof(Int32))
                {
                    parameterValues[i] = Convert.ToInt32(methodArgs[i]);
                }
                else if (parameterType == typeof(Single))
                {
                    parameterValues[i] = Convert.ToSingle(methodArgs[i]);
                }
                else if (parameterType == typeof(Double))
                {
                    parameterValues[i] = Convert.ToDouble(methodArgs[i]);
                }
                else if (parameterType == typeof(Boolean))
                {
                    parameterValues[i] = Convert.ToBoolean(methodArgs[i]);
                }
                else if (parameterType == typeof(String))
                {
                    parameterValues[i] = Convert.ToString(methodArgs[i]);
                }
                else if (parameterType.IsEnum)
                {
                    if (methodArgs[i] is String)
                    {
                        parameterValues[i] = System.Enum.Parse(parameterType, (String)(methodArgs[i]), true);
                    }
                    else if (methodArgs[i] is int)
                    {
                        parameterValues[i] = Enum.ToObject(parameterType, methodArgs[i]);
                    }
                    else
                    {
                        var cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                        throw new ArgumentException(
                            String.Format(cultureInfo, Resources.Messages.InvalidEnumValue,
                            parameterType.FullName));
                    }
                }
                else
                {
                    var cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                    throw new RemoteScriptingTypeNotSupportedException(
                        String.Format(cultureInfo, Resources.Messages.TypeNotSupportedForMarshalling,
                        parameterType.FullName));
                }
            }

            return methodInfo.Invoke(instance, parameterValues);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_navigator != null)
                {
                    _navigator.Disconnect();
                    _navigator = null;
                }

                if (_rubberband != null)
                {
                    _rubberband.Disconnect();
                    _rubberband = null;
                }
            }
        }

        protected virtual void UpdateViewport()
        {
            if (!this.NeedUpdateViewportOnClientSide)
            {
                var rulerWidth = this.RulerEnabled ? this.RulerWidth : 0;

                if (_zoomMode == ZoomMode.ZoomControl)
                {
                    var sbw = (this.ScrollBarsStyle == ScrollBarsStyle.Auto) ? 0 : this.ScrollBarWidth;
                    base.Width = new System.Web.UI.WebControls.Unit(this.ContentWidth + sbw + rulerWidth, UnitType.Pixel);
                    base.Height = new System.Web.UI.WebControls.Unit(this.ContentHeight + sbw + rulerWidth, UnitType.Pixel);
                }
                else if (_zoomMode != ZoomMode.None)
                {
                    var viewportTotalRectangle = new Size(this.InnerWidth - rulerWidth, this.InnerHeight - rulerWidth);

                    float scaledWorkspaceWidth = Common.ConvertPointsToPixels(this.ScreenXDpi, this.WorkspaceWidth);
                    float scaledWorkspaceHeight = Common.ConvertPointsToPixels(this.ScreenYDpi, this.WorkspaceHeight);

                    var horizontalZoomWithoutScrollBars = viewportTotalRectangle.Width / scaledWorkspaceWidth;
                    var verticalZoomWithoutScrollBars = viewportTotalRectangle.Height / scaledWorkspaceHeight;

                    var horizontalZoom = (viewportTotalRectangle.Width - _scrollBarWidth) / scaledWorkspaceWidth;
                    var verticalZoom = (viewportTotalRectangle.Height - _scrollBarWidth) / scaledWorkspaceHeight;

                    var zoom = _zoom;
                    var scrollBarsAlways = (this._scrollBarsStyle == ScrollBarsStyle.Always);

                    switch (_zoomMode)
                    {
                        case ZoomMode.BestFit:
                            zoom = scrollBarsAlways ? Math.Min(horizontalZoom, verticalZoom) :
                                Math.Min(horizontalZoomWithoutScrollBars, verticalZoomWithoutScrollBars);
                            break;

                        case ZoomMode.BestFitShrinkOnly:
                            zoom = scrollBarsAlways ? Math.Min(horizontalZoom, verticalZoom) :
                                Math.Min(horizontalZoomWithoutScrollBars, verticalZoomWithoutScrollBars);
                            zoom = Math.Min(1.0F, zoom);
                            break;

                        case ZoomMode.FitToHeight:
                            if (scrollBarsAlways)
                            {
                                zoom = verticalZoom;
                            }
                            else
                            {
                                zoom = (Math.Round(verticalZoomWithoutScrollBars * scaledWorkspaceWidth) <= viewportTotalRectangle.Width) ?
                                    verticalZoomWithoutScrollBars : verticalZoom;
                            }
                            break;

                        case ZoomMode.FitToHeightShrinkOnly:
                            if (scrollBarsAlways)
                            {
                                zoom = Math.Min(1.0F, verticalZoom);
                            }
                            else
                            {
                                zoom = (Math.Round(Math.Min(1.0F, verticalZoomWithoutScrollBars) * scaledWorkspaceWidth) <= viewportTotalRectangle.Width) ?
                                    Math.Min(1.0F, verticalZoomWithoutScrollBars) : Math.Min(1.0F, verticalZoom);
                            }
                            break;

                        case ZoomMode.FitToWidth:
                            if (scrollBarsAlways)
                            {
                                zoom = horizontalZoom;
                            }
                            else
                            {
                                zoom = (Math.Round(horizontalZoomWithoutScrollBars * scaledWorkspaceHeight) <= viewportTotalRectangle.Height) ?
                                    horizontalZoomWithoutScrollBars : horizontalZoom;
                            }
                            break;

                        case ZoomMode.FitToWidthShrinkOnly:
                            if (scrollBarsAlways)
                            {
                                zoom = Math.Min(1.0F, horizontalZoom);
                            }
                            else
                            {
                                zoom = (Math.Round(Math.Min(1.0F, horizontalZoomWithoutScrollBars) * scaledWorkspaceHeight) <= viewportTotalRectangle.Height) ?
                                    Math.Min(1.0F, horizontalZoomWithoutScrollBars) : Math.Min(1.0F, horizontalZoom);
                            }
                            break;
                    }
                    _zoom = Math.Min(Math.Max(zoom, _minZoom), _maxZoom);
                }
            }
        }

        /// <summary>
        /// Convert coordinates of point on workspace to coordinates of point on control
        /// </summary>
        /// <param name="point">Point on workspace (in points)</param>
        /// <returns>Point on control (in pixels)</returns>
        public virtual PointF WorkspaceToControl(PointF point)
        {
            RectangleF bounds = this.ViewportBounds;
            PointF leftTop = new PointF(bounds.Left, bounds.Top);
            PointF scroll = this.ScrollingPosition;
            PointF pt = new PointF(
                Common.ConvertPointsToPixels(ScreenXDpi, point.X) * Zoom,
                Common.ConvertPointsToPixels(ScreenYDpi, point.Y) * Zoom);
            return new PointF(pt.X - scroll.X + leftTop.X, pt.Y - scroll.Y + leftTop.Y);
        }

        public virtual RectangleF WorkspaceToControl(RectangleF rect)
        {
            PointF pt1 = WorkspaceToControl(new PointF(rect.X, rect.Y));
            PointF pt2 = WorkspaceToControl(new PointF(rect.X + rect.Width, rect.Y + rect.Height));
            return RectangleF.FromLTRB(pt1.X, pt1.Y, pt2.X, pt2.Y);
        }

        public virtual PointF ControlToWorkspace(PointF point)
        {
            RectangleF bounds = this.ViewportBounds;
            PointF leftTop = new PointF(bounds.Left, bounds.Top);
            PointF scroll = this.ScrollingPosition;
            PointF pt = new PointF(point.X + scroll.X - leftTop.X, point.Y + scroll.Y - leftTop.Y);
            return new PointF(Common.ConvertPixelsToPoints(ScreenXDpi, Convert.ToInt32(pt.X)) / Zoom,
                Common.ConvertPixelsToPoints(ScreenYDpi, Convert.ToInt32(pt.Y)) / Zoom);
        }

        public virtual RectangleF ControlToWorkspace(RectangleF rect)
        {
            PointF pt1 = ControlToWorkspace(new PointF(rect.X, rect.Y));
            PointF pt2 = ControlToWorkspace(new PointF(rect.X + rect.Width, rect.Y + rect.Height));
            return RectangleF.FromLTRB(pt1.X, pt1.Y, pt2.X, pt2.Y);
        }

        #endregion Protected members

        #region Private members

        private void ConnectNavigator()
        {
            if (_navigatorID == null || _navigatorID.Length == 0)
            {
                _navigator = null;
            }
            else
            {
                // Try to locate attached Navigator by ID or ClientID.
                INavigator navigator;
                try
                {
                    Control n = null;
                    FindControlRecursive(ref n, Page.Form, _navigatorID);
                    navigator = (INavigator)n;
                }
                catch (System.InvalidCastException)
                {
                    System.Globalization.CultureInfo cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                    throw new System.InvalidCastException(String.Format(cultureInfo,
                        Resources.Messages.ControlIsNotNavigator,
                        _navigatorID));
                }
                if (navigator == null)
                {
                    System.Globalization.CultureInfo cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                    throw new ControlNotFoundException(
                        String.Format(cultureInfo,
                        Resources.Messages.ReferencedControlNotFound,
                        _navigatorID));
                }
                _navigator = navigator;

                // Connect to viewer.
                _navigator.Connect(this);
            }
        }

        private string _msTouchActionInitialValue = "pan-x pan-y";

        private void ConnectRubberband()
        {
            if (String.IsNullOrEmpty(_rubberbandID))
            {
                _rubberband = null;
            }
            else
            {
                // Try to locate attached Rubberband by ID or ClientID.
                IRubberband rubberband;
                try
                {
                    Control r = null;
                    FindControlRecursive(ref r, Page.Form, _rubberbandID);
                    rubberband = (IRubberband)r;
                }
                catch (System.InvalidCastException)
                {
                    var cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                    throw new System.InvalidCastException(String.Format(cultureInfo,
                        Resources.Messages.ControlIsNotRubberband,
                        _rubberbandID));
                }
                if (rubberband == null)
                {
                    var cultureInfo = new System.Globalization.CultureInfo("en-us", true);
                    throw new ControlNotFoundException(
                        String.Format(cultureInfo,
                        Resources.Messages.ReferencedControlNotFound,
                        _rubberbandID));
                }
                _rubberband = rubberband;

                _msTouchActionInitialValue = "none";

                // Connect to viewer.
                _rubberband.Connect(this);
            }
        }

        #endregion Private members

        #region Internal members

        // Returns whether we can calculate viewport size on server side
        internal bool NeedUpdateViewportOnClientSide
        {
            get
            {
                if (this.ZoomMode == ZoomMode.None || this.ZoomMode == ZoomMode.ZoomControl)
                {
                    return false;
                }

                return this.Width.Type != UnitType.Pixel || this.Height.Type != UnitType.Pixel;
            }
        }

        internal int InnerWidth
        {
            get
            {
                return (int)this.Width.Value/* - ActualBorderWidth * 2*/;
            }
        }

        internal int InnerHeight
        {
            get
            {
                return (int)this.Height.Value/* - ActualBorderWidth * 2*/;
            }
        }

        internal int ActualBorderWidth
        {
            get
            {
                if (this.BorderStyle == System.Web.UI.WebControls.BorderStyle.None || this.BorderStyle == System.Web.UI.WebControls.BorderStyle.NotSet)
                {
                    return 0;
                }
                else
                {
                    return (int)(this.BorderWidth.Value);
                }
            }
        }

        public RectangleF ViewportBounds
        {
            get
            {
                if (this.Width.Type != UnitType.Pixel || this.Height.Type != UnitType.Pixel)
                {
                    return RectangleF.Empty;
                }

                PointF topLeft = new PointF(this.ScrollingPosition.X / (this.Zoom * this.ActualSizeHorizontalScale),
                    this.ScrollingPosition.Y / (this.Zoom * this.ActualSizeVerticalScale));

                // convert workspace from points to pixels with content dpi
                PointF maxRB = new PointF(
                    Common.ConvertPointsToPixels(this.ScreenXDpi / this.ActualSizeHorizontalScale, this.WorkspaceWidth),
                    Common.ConvertPointsToPixels(this.ScreenYDpi / this.ActualSizeVerticalScale, this.WorkspaceHeight));

                PointF RB = new PointF(this.ScrollingPosition.X + (float)(this.Width.Value), this.ScrollingPosition.Y + (float)(this.Height.Value));
                RB = new PointF(RB.X / (this.Zoom * this.ActualSizeHorizontalScale), RB.Y / (this.Zoom * this.ActualSizeVerticalScale));

                return RectangleF.FromLTRB(topLeft.X, topLeft.Y, Math.Min(RB.X, maxRB.X), Math.Min(RB.Y, maxRB.Y));
            }
        }

        internal Aurigma.GraphicsMill.Transforms.ResizeInterpolationMode InterpolationMode
        {
            get
            {
                switch (this.ZoomQuality)
                {
                    case ZoomQuality.Low:
                        return Aurigma.GraphicsMill.Transforms.ResizeInterpolationMode.Low;

                    case ZoomQuality.High:
                    case ZoomQuality.ShrinkHighStretchLow:
                        return Aurigma.GraphicsMill.Transforms.ResizeInterpolationMode.High;

                    default: // ZoomQuality.Medium
                        return Aurigma.GraphicsMill.Transforms.ResizeInterpolationMode.Medium;
                }
            }
        }

        #endregion Internal members
    }
}