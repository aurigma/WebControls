// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;

namespace Aurigma.GraphicsMill.AjaxControls
{
    [System.Drawing.ToolboxBitmap(typeof(RectangleRubberband), "Resources.RectangleRubberband.bmp")]
    [DefaultEvent("RectangleChanged")]
    [NonVisualControl]
    public class RectangleRubberband : RectangleController, IRubberband, IPostBackEventHandler

    {
        /// <summary>
        /// Private structure for control state deserialization
        /// </summary>
        private struct RectangleRubberbandState
        {
            public bool AutoPostBack;
            public bool Erasable;
            public int GripSize;
            public bool GripsVisible;
            public bool MaskVisible;
            public int MaskOpacity;
            public byte MaskColorRed;
            public byte MaskColorGreen;
            public byte MaskColorBlue;
            public bool Movable;
            public float Ratio;
            public System.Drawing.Rectangle Rectangle;
            public int ResizeMode;
            public bool RectangleChanged;

            public static RectangleRubberbandState Empty
            {
                get
                {
                    RectangleRubberbandState instance;

                    instance.AutoPostBack = false;
                    instance.Erasable = true;
                    instance.GripSize = 9;
                    instance.GripsVisible = false;
                    instance.MaskVisible = false;
                    instance.MaskOpacity = 50;
                    instance.MaskColorRed = 0;
                    instance.MaskColorGreen = 0;
                    instance.MaskColorBlue = 0;
                    instance.Movable = true;
                    instance.Ratio = 1;
                    instance.Rectangle = Rectangle.Empty;
                    instance.ResizeMode = Convert.ToInt32(AjaxControls.ResizeMode.Arbitrary, Common.GetNumberFormat());
                    instance.RectangleChanged = false;

                    return instance;
                }
            }
        }

        private bool _autoPostBack;

        private RectangleRubberbandState _postedState;

        public RectangleRubberband() : base()
        {
            _erasable = true;
            _gripSize = 8;
            _gripsVisible = false;
            _maskVisible = false;
            _movable = true;
            _outlineWidth = 1;
            _ratio = 1;
            _rectangle = System.Drawing.Rectangle.Empty;
            _resizeMode = ResizeMode.Arbitrary;

            _postedState = RectangleRubberbandState.Empty;

            ScriptClassName = "Aurigma.GraphicsMill.RectangleRubberband";
        }

        #region Public members

        [Browsable(true)]
        [ResDescription("RectangleRubberband_AutoPostBack")]
        [DefaultValue(false)]
        public bool AutoPostBack
        {
            get
            {
                return _autoPostBack;
            }

            set
            {
                _autoPostBack = value;
            }
        }

        [Browsable(true)]
        [ResDescription("RectangleRubberband_Erasable")]
        [DefaultValue(true)]
        public bool Erasable
        {
            get
            {
                return _erasable;
            }

            set
            {
                _erasable = value;
            }
        }

        [Browsable(true)]
        [ResDescription("RectangleRubberband_GripSize")]
        [DefaultValue(8)]
        public int GripSize
        {
            get
            {
                return _gripSize;
            }

            set
            {
                _gripSize = value;
            }
        }

        [Browsable(true)]
        [ResDescription("RectangleRubberband_GripsVisible")]
        [DefaultValue(false)]
        public bool GripsVisible
        {
            get
            {
                return _gripsVisible;
            }

            set
            {
                _gripsVisible = value;
            }
        }

        [Browsable(false)]
        public bool IsEmpty
        {
            get
            {
                return !(_rectangle.Width > 0 && _rectangle.Height > 0);
            }
        }

        [Browsable(true)]
        [ResDescription("RectangleRubberband_MaskVisible")]
        [DefaultValue(false)]
        public bool MaskVisible
        {
            get
            {
                return _maskVisible;
            }

            set
            {
                _maskVisible = value;
            }
        }

        [Browsable(true)]
        [ResDescription("RectangleRubberband_MaskOpacity")]
        [DefaultValue(50)]
        public int MaskOpacity
        {
            get
            {
                return _maskOpacity;
            }
            set
            {
                if ((_maskOpacity < 0) || (_maskOpacity > 100))
                    throw new ArgumentOutOfRangeException("value",
                        Resources.Messages.MaskOpacityIsOutOfRange);
                _maskOpacity = value;
            }
        }

        [Browsable(true)]
        [ResDescription("RectangleRubberband_MaskColor")]
        [DefaultValue("#000000")]
        public System.Drawing.Color MaskColor
        {
            get
            {
                return System.Drawing.Color.FromArgb(this._maskOpacity, this._maskColorRedComponent, this._maskColorGreenComponent,
                                                     this._maskColorBlueComponent);
            }
            set
            {
                this._maskColorBlueComponent = value.B;
                this._maskColorGreenComponent = value.G;
                this._maskColorRedComponent = value.R;
            }
        }

        [Browsable(true)]
        [ResDescription("RectangleRubberband_Movable")]
        [DefaultValue(false)]
        public bool Movable
        {
            get
            {
                return _movable;
            }

            set
            {
                _movable = value;
            }
        }

        [Browsable(true)]
        [ResDescription("RectangleRubberband_Ratio")]
        [DefaultValue(1f)]
        public float Ratio
        {
            get
            {
                return _ratio;
            }

            set
            {
                _ratio = value;
            }
        }

        [Browsable(true)]
        [ResDescription("RectangleRubberband_Rectangle")]
        [DefaultValue("0; 0; 0; 0")]
        public System.Drawing.Rectangle Rectangle
        {
            get
            {
                return _rectangle;
            }

            set
            {
                _rectangle = value;
            }
        }

        [Browsable(true)]
        [ResDescription("RectangleRubberband_ResizeMode")]
        [DefaultValue(ResizeMode.Arbitrary)]
        public ResizeMode ResizeMode
        {
            get
            {
                return _resizeMode;
            }

            set
            {
                _resizeMode = value;
            }
        }

        public void Erase()
        {
            if (_erasable)
            {
                _rectangle = System.Drawing.Rectangle.Empty;
            }
        }

        [Browsable(true)]
        [ResDescription("RectangleRubberband_RectangleChanged")]
        public event EventHandler<RectangleEventArgs> RectangleChanged;

        void IPostBackEventHandler.RaisePostBackEvent(string eventArgument)
        {
            RaisePostBackEvent(eventArgument);
        }

        #endregion Public members

        #region Protected members

        protected override bool LoadPostData(string postDataKey, System.Collections.Specialized.NameValueCollection postCollection)
        {
            bool baseLoadPostData = base.LoadPostData(postDataKey, postCollection);

            string state = postCollection[GetStateFieldId()];

            if (String.IsNullOrEmpty(state))
            {
                return false;
            }

            var jss = new System.Web.Script.Serialization.JavaScriptSerializer();

            _postedState = jss.Deserialize<RectangleRubberbandState>(state);

            _autoPostBack = _postedState.AutoPostBack;
            _erasable = _postedState.Erasable;
            _gripSize = _postedState.GripSize;
            _gripsVisible = _postedState.GripsVisible;
            _maskVisible = _postedState.MaskVisible;
            _maskOpacity = _postedState.MaskOpacity;
            _maskColorRedComponent = _postedState.MaskColorRed;
            _maskColorGreenComponent = _postedState.MaskColorGreen;
            _maskColorBlueComponent = _postedState.MaskColorBlue;
            _movable = _postedState.Movable;
            _ratio = _postedState.Ratio;

            if (_postedState.Rectangle.Width < 0 || _postedState.Rectangle.Height < 0)
            {
                _rectangle = Rectangle.Empty;
            }
            else
            {
                _rectangle = _postedState.Rectangle;
            }

            _resizeMode = (ResizeMode)(_postedState.ResizeMode);

            if (_postedState.RectangleChanged)
            {
                return true;
            }

            return baseLoadPostData;
        }

        protected override void RaisePostDataChangedEvent()
        {
            OnRectangleChanged();
        }

        protected virtual void RaisePostBackEvent(string eventArgument)
        {
            if (eventArgument == "RectangleChanged")
            {
                OnRectangleChanged();
            }
        }

        protected void OnRectangleChanged()
        {
            if (RectangleChanged != null)
            {
                RectangleChanged(this, new RectangleEventArgs(this.Rectangle));
            }
        }

        protected override void InitScriptDescriptor(ScriptControlDescriptor descriptor)
        {
            System.Globalization.NumberFormatInfo format = Common.GetNumberFormat();

            descriptor.AddProperty("_autoPostBack", _autoPostBack);
            descriptor.AddProperty("_erasable", _erasable);
            descriptor.AddProperty("_gripsVisible", _gripsVisible);
            descriptor.AddProperty("_gripSize", _gripSize);
            descriptor.AddProperty("_maskVisible", _maskVisible);
            descriptor.AddProperty("_maskOpacity", _maskOpacity);
            descriptor.AddProperty("_maskColorRed", _maskColorRedComponent);
            descriptor.AddProperty("_maskColorGreen", _maskColorGreenComponent);
            descriptor.AddProperty("_maskColorBlue", _maskColorBlueComponent);
            descriptor.AddProperty("_movable", _movable);
            descriptor.AddProperty("_ratio", _ratio);
            descriptor.AddProperty("_resizeMode", _resizeMode);

            if (_rectangle.IsEmpty)
            {
                descriptor.AddScriptProperty("_rectangle", "{x:0,y:0,width:-1,height:-1}");
            }
            else
            {
                descriptor.AddScriptProperty("_rectangle", String.Format(format, "{{x:{0},y:{1},width:{2},height:{3}}}",
                    _rectangle.Left, _rectangle.Top, _rectangle.Width, _rectangle.Height));
            }

            descriptor.AddScriptProperty("_rectangleChangedPostBack", "function(){"
                + Page.ClientScript.GetPostBackEventReference(this, "RectangleChanged") + "}");

            base.InitScriptDescriptor(descriptor);
        }

        #endregion Protected members
    }
}