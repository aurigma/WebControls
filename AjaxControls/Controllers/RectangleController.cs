// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Drawing;
using System.Web.UI;

namespace Aurigma.GraphicsMill.AjaxControls
{
    [NonVisualControl]
    public abstract class RectangleController : UserInputController, IPostBackDataHandler
    {
        private struct RectangleControllerState
        {
            public int OutlineWidth;

            public static RectangleControllerState Empty
            {
                get
                {
                    RectangleControllerState instance;

                    instance.OutlineWidth = 1;

                    return instance;
                }
            }
        }

        // We need to use "internal" for preventing FxCop warnings
        internal int _gripSize;

        internal bool _gripsVisible;
        internal int _maskOpacity;
        internal byte _maskColorRedComponent;
        internal byte _maskColorGreenComponent;
        internal byte _maskColorBlueComponent;
        internal bool _erasable;
        internal bool _maskVisible;
        internal bool _movable;
        internal float _ratio;
        internal ResizeMode _resizeMode = ResizeMode.Arbitrary;
        internal System.Drawing.Rectangle _rectangle;
        internal System.Drawing.Color _outlineColor;
        internal System.Web.UI.WebControls.BorderStyle _outlineStyle;
        internal int _outlineWidth;

        private RectangleControllerState _postedState;

        protected RectangleController() : base()
        {
            _movable = true;
            _erasable = true;
            _gripSize = 9;
            _maskVisible = true;
            _maskOpacity = 50;
            _maskColorRedComponent = 0;
            _maskColorGreenComponent = 0;
            _maskColorBlueComponent = 0;
            _outlineWidth = 1;
            _ratio = 1;
            _rectangle = System.Drawing.Rectangle.Empty;
            _resizeMode = ResizeMode.Arbitrary;

            _postedState = RectangleControllerState.Empty;

            RenderState = true;
        }

        #region Public members

        bool IPostBackDataHandler.LoadPostData(string postDataKey, System.Collections.Specialized.NameValueCollection postCollection)
        {
            return LoadPostData(postDataKey, postCollection);
        }

        void IPostBackDataHandler.RaisePostDataChangedEvent()
        {
            RaisePostDataChangedEvent();
        }

        #endregion Public members

        #region Protected members

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            Page.RegisterRequiresPostBack(this);
        }

        protected virtual bool LoadPostData(string postDataKey, System.Collections.Specialized.NameValueCollection postCollection)
        {
            string state = postCollection[GetStateFieldId()];

            if (String.IsNullOrEmpty(state))
            {
                return false;
            }

            var jss =
                new System.Web.Script.Serialization.JavaScriptSerializer();

            _postedState = jss.Deserialize<RectangleControllerState>(state);
            _outlineWidth = _postedState.OutlineWidth;

            return false;
        }

        protected virtual void RaisePostDataChangedEvent()
        {
        }

        protected override void InitScriptDescriptor(ScriptControlDescriptor descriptor)
        {
            descriptor.AddProperty("_outlineWidth", _outlineWidth);

            base.InitScriptDescriptor(descriptor);
        }

        protected override void OnContentChanged(System.EventArgs e)
        {
            if (Viewer != null)
            {
                var contentRect = new Rectangle(0, 0, (int)Math.Round(Viewer.WorkspaceWidth), (int)Math.Round(Viewer.WorkspaceHeight));
                contentRect.Intersect(_rectangle);
            }
        }

        #endregion Protected members
    }
}