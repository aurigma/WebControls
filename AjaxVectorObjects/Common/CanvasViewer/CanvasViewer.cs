// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Web.UI;
using AvoCommon = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Common;

namespace Aurigma.GraphicsMill.AjaxControls
{
    public class CanvasViewer : BaseViewer, INamingContainer
    {
        public CanvasViewer()
            : base()
        {
            var canvas = new Canvas { ID = "canvas" };

            canvas.ZoomChanged += (sender, args) =>
                                      {
                                          if (ZoomMode != ZoomMode.None)
                                              ZoomMode = ZoomMode;
                                          else
                                              Zoom = ((Canvas)sender).Zoom;
                                      };

            this.Controls.Add(canvas);
            this.ScriptClassName = "Aurigma.GraphicsMill.AjaxControls.CanvasViewer";
            this.ClearSelectionOnDocumentClick = true;
        }

        protected override IEnumerable<ScriptReference> GetScriptReferences()
        {
            var references = base.GetScriptReferences().ToList();

            if (!ExcludeScripts)
            {
                var sref = new ScriptReference
                {
                    Assembly =
                        Type.GetType("Aurigma.GraphicsMill.AjaxControls.CanvasViewer").Assembly.FullName,
                    Name =
                        Type.GetType("Aurigma.GraphicsMill.AjaxControls.CanvasViewer")
                            .Assembly.GetName()
                            .Name + ".Resources.CanvasViewer.js"
                };
                references.Add(sref);
            }

            return references;
        }

        public override bool ExcludeScripts
        {
            get { return base.ExcludeScripts; }
            set
            {
                base.ExcludeScripts = value;
                Canvas.ExcludeScripts = value;
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        [PersistenceModeAttribute(PersistenceMode.InnerProperty)]
        public Canvas Canvas
        {
            get
            {
                return (Canvas)this.Controls[0];
            }
        }

        protected override void InitScriptDescriptor(ScriptControlDescriptor descriptor)
        {
            base.InitScriptDescriptor(descriptor);
            descriptor.AddProperty("_canvasId", this.Controls[0].ClientID);
            descriptor.AddProperty("_modalBgClass", this.ModalBgClass);
            descriptor.AddProperty("_clearSelectionOnDocumentClick", this.ClearSelectionOnDocumentClick);
            descriptor.Type = "Aurigma.GraphicsMill.AjaxControls.CanvasViewer";
        }

        [Browsable(true)]
        [DefaultValue(ZoomMode.None)]
        public override ZoomMode ZoomMode
        {
            get
            {
                return base.ZoomMode;
            }

            set
            {
                base.ZoomMode = value;
            }
        }

        [Browsable(true)]
        [DefaultValue(1f)]
        public override float Zoom
        {
            get
            {
                return base.Zoom;
            }

            set
            {
                Canvas.SetZoom(value, true);

                base.Zoom = Canvas.Zoom;
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public override float ActualSizeVerticalScale
        {
            get
            {
                return ScreenYDpi / 72.0F;
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public override float ActualSizeHorizontalScale
        {
            get
            {
                return ScreenXDpi / 72.0F;
            }
        }

        public override float WorkspaceHeight
        {
            get
            {
                return this.Canvas.WorkspaceHeight;
            }
        }

        public override float WorkspaceWidth
        {
            get
            {
                return this.Canvas.WorkspaceWidth;
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public override int ContentHeight
        {
            get
            {
                return (int)(Math.Round(AvoCommon.ConvertPointsToPixels(this.ScreenYDpi, this.WorkspaceHeight) * this.Zoom));
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public override int ContentWidth
        {
            get
            {
                return (int)(Math.Round(AvoCommon.ConvertPointsToPixels(this.ScreenXDpi, this.WorkspaceWidth) * this.Zoom));
            }
        }

        public override PointF WorkspaceToControl(PointF point)
        {
            RectangleF bounds = base.ViewportBounds;
            PointF leftTop = new PointF(bounds.Left, bounds.Top);
            PointF scroll = this.ScrollingPosition;
            PointF pt = new PointF(point.X * this.Zoom * this.ActualSizeHorizontalScale, point.Y * this.Zoom * this.ActualSizeVerticalScale);
            return new PointF(pt.X - scroll.X + leftTop.X, pt.Y - scroll.Y + leftTop.Y);
        }

        public override RectangleF WorkspaceToControl(RectangleF rect)
        {
            PointF pt1 = WorkspaceToControl(new PointF(rect.X, rect.Y));
            PointF pt2 = WorkspaceToControl(new PointF(rect.X + rect.Width, rect.Y + rect.Height));
            return RectangleF.FromLTRB(pt1.X, pt1.Y, pt2.X, pt2.Y);
        }

        public override PointF ControlToWorkspace(PointF point)
        {
            RectangleF bounds = this.ViewportBounds;
            PointF leftTop = new PointF(bounds.Left, bounds.Top);
            PointF scroll = this.ScrollingPosition;
            PointF pt = new PointF(point.X + scroll.X - leftTop.X, point.Y + scroll.Y - leftTop.Y);
            return new PointF(pt.X / (this.Zoom * this.ActualSizeHorizontalScale), pt.Y / (this.Zoom * this.ActualSizeVerticalScale));
        }

        public override RectangleF ControlToWorkspace(RectangleF rect)
        {
            PointF pt1 = ControlToWorkspace(new PointF(rect.X, rect.Y));
            PointF pt2 = ControlToWorkspace(new PointF(rect.X + rect.Width, rect.Y + rect.Height));
            return RectangleF.FromLTRB(pt1.X, pt1.Y, pt2.X, pt2.Y);
        }

        private string _callbackResult = "";

        private string GetCallBackExecutionCodes(Control cl)
        {
            string result = "";
            if ((cl is ICallBackDataHandler) && (cl != this))
                result += ((ICallBackDataHandler)cl).GetCallBackExecutionCode();
            for (int i = 0; i < cl.Controls.Count; i++)
            {
                result += GetCallBackExecutionCodes(cl.Controls[i]);
            }
            return result;
        }

        protected override string GetCallbackResult()
        {
            return GetCallBackExecutionCodes(this.Page) + _callbackResult;
        }

        protected override void RaiseCallbackEvent(string eventArgument)
        {
            var serializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            var callbackArgs = (object[])(serializer.DeserializeObject(eventArgument));

            var methodName = (string)(callbackArgs[0]);
            var methodArgs = (object[])(callbackArgs[1]);

            if (methodName == "__Refresh")
            {
                _callbackResult = "";
            }
            else
            {
                // Process all other callbacks except Refresh

                // Try to find method first of all in NamingContainer, next in BindingContainer and to the end
                // into Parent element.

                // Get type of instance
                var objectType = this.NamingContainer.GetType();
                var methodContainer = this.NamingContainer;

                // Get specified method
                var methodInfo = objectType.GetMethod(methodName);

                if (methodInfo == null)
                {
                    objectType = this.BindingContainer.GetType();
                    methodContainer = this.BindingContainer;
                    methodInfo = objectType.GetMethod(methodName);
                }

                if (methodInfo == null)
                    methodContainer = this.Parent;

                object returnValue = InvokeRemoteScriptingMethod(methodContainer, methodName,
                                                                 methodArgs);

                var code = new StringBuilder();

                var v = "$find(\"" + this.ClientID + "\")";
                code.Append(v + "._returnValue=" + serializer.Serialize(returnValue) + ";");

                code.Append(GetState());

                _callbackResult = code.ToString();
            }
        }

        public override float ScreenXDpi
        {
            get
            {
                return 96;
            }
            set
            {
                throw ExceptionFactory.NotSupportedException();
            }
        }

        public override float ScreenYDpi
        {
            get
            {
                return 96;
            }
            set
            {
                throw ExceptionFactory.NotSupportedException();
            }
        }

        public string ModalBgClass { get; set; }

        public bool ClearSelectionOnDocumentClick { get; set; }

        protected string GetState()
        {
            System.Globalization.NumberFormatInfo format = AvoCommon.GetNumberFormat();
            StringBuilder code = new StringBuilder();
            string v = "$find(\"" + this.ClientID + "\")";
            string needToRefresh = v + "._needToRefresh=false;";
            code.Append(v + "._scrollingPosition=new Aurigma.GraphicsMill.PointF(" +
                        this.ScrollingPosition.X.ToString(format) + "," + this.ScrollingPosition.Y.ToString(format) + ");");
            code.Append(v + "._zoom=" + this.Zoom.ToString(format) + ";");
            code.Append(v + "._zoomMode=" + System.Convert.ToInt32(this.ZoomMode, format).ToString(format) + ";");
            code.Append(needToRefresh);
            return code.ToString();
        }

        protected override void Render(HtmlTextWriter writer)
        {
            this.Canvas.RenderControl(writer);
            base.Render(writer);
        }
    }
}