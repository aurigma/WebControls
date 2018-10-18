// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.ComponentModel;
using System.Web.UI;

namespace Aurigma.GraphicsMill.AjaxControls
{
    [NonVisualControl]
    public abstract class UserInputController : BaseScriptControl, IUserInputController
    {
        private BaseViewer _viewer;

        protected UserInputController()
            : base()
        {
            ScriptFiles.Add("Controller");
        }

        #region Public members

        // Hide properties from displaying in object browser
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        public override string AccessKey
        {
            get
            {
                return "";
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        public override System.Drawing.Color BackColor
        {
            get
            {
                return System.Drawing.Color.Empty;
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        public override System.Drawing.Color BorderColor
        {
            get
            {
                return System.Drawing.Color.Empty;
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        public override System.Web.UI.WebControls.BorderStyle BorderStyle
        {
            get
            {
                return System.Web.UI.WebControls.BorderStyle.NotSet;
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        public override System.Web.UI.WebControls.Unit BorderWidth
        {
            get
            {
                return System.Web.UI.WebControls.Unit.Empty;
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        public override string CssClass
        {
            get
            {
                return "";
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        public override bool Enabled
        {
            get
            {
                return true;
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
        public override System.Web.UI.WebControls.Unit Height
        {
            get
            {
                return System.Web.UI.WebControls.Unit.Empty;
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        public override short TabIndex
        {
            get
            {
                return 0;
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        public override string ToolTip
        {
            get
            {
                return "";
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        public override bool Visible
        {
            get
            {
                return true;
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        public override System.Web.UI.WebControls.Unit Width
        {
            get
            {
                return System.Web.UI.WebControls.Unit.Empty;
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

        void IUserInputController.Connect(Aurigma.GraphicsMill.AjaxControls.BaseViewer viewer)
        {
            Connect(viewer);
        }

        void IUserInputController.Disconnect()
        {
            Disconnect();
        }

        void IUserInputController.Update()
        {
            Update();
        }

        #endregion Public members

        #region Protected members

        protected BaseViewer Viewer
        {
            get
            {
                return _viewer;
            }
        }

        protected virtual void Connect(Aurigma.GraphicsMill.AjaxControls.BaseViewer viewer)
        {
            _viewer = viewer;

            if (_viewer != null)
                _viewer.WorkspaceChanged += new System.EventHandler(this.ContentChangedEventHandler);
        }

        protected virtual void Disconnect()
        {
            if (_viewer != null)
                _viewer.WorkspaceChanged -= new System.EventHandler(this.ContentChangedEventHandler);

            _viewer = null;
        }

        protected virtual void Update()
        {
        }

        protected void ContentChangedEventHandler(object sender, System.EventArgs e)
        {
            OnContentChanged(e);
        }

        protected virtual void OnContentChanged(System.EventArgs e)
        {
        }

        protected override void Render(HtmlTextWriter writer)
        {
            if (DesignMode)
            {
                IServiceProvider serviceProvider = (IServiceProvider)this.Site;

                IResourceUrlGenerator urlGenerator = (IResourceUrlGenerator)serviceProvider.GetService(typeof(IResourceUrlGenerator));

                writer.WriteBeginTag("div");
                writer.Write(" style=\"");

                if (urlGenerator != null)
                {
                    writer.WriteStyleAttribute("background-image", "url('" + urlGenerator.GetResourceUrl(this.GetType(),
                        "Aurigma.GraphicsMill.AjaxControls.Resources.Background.gif") + "');");
                }

                writer.WriteStyleAttribute("background-position", "bottom");
                writer.WriteStyleAttribute("background-repeat", "repeat-x");
                writer.WriteStyleAttribute("background-color", "#FFFFFF");
                writer.WriteStyleAttribute("color", "#444444");
                writer.WriteStyleAttribute("font", "messagebox");
                writer.WriteStyleAttribute("border", "1px solid #CCCCCC");
                writer.WriteStyleAttribute("padding", "4px 4px 0px 4px");
                writer.WriteStyleAttribute("left", this.Style["LEFT"]);
                writer.WriteStyleAttribute("top", this.Style["TOP"]);
                writer.WriteStyleAttribute("position", this.Style["POSITION"]);
                writer.Write("\"");

                writer.Write(HtmlTextWriter.TagRightChar);
                if (urlGenerator != null)
                {
                    writer.WriteBeginTag("img");
                    writer.WriteAttribute("width", "16");
                    writer.WriteAttribute("height", "16");
                    writer.WriteAttribute("align", "middle");
                    writer.WriteAttribute("src", urlGenerator.GetResourceUrl(this.GetType(),
                        "Aurigma.GraphicsMill.AjaxControls.Resources." + this.GetType().Name + ".gif"));
                    writer.Write(" ");
                    writer.Write(HtmlTextWriter.SelfClosingTagEnd);
                }
                writer.Write("&nbsp;<b>");
                writer.Write(this.GetType().Name);
                writer.Write("</b>&nbsp;-&nbsp;");
                writer.Write(ID);
                writer.WriteEndTag("div");
            }
            else
            {
                writer.WriteBeginTag("span");
                writer.WriteAttribute("id", ClientID);
                writer.WriteAttribute("style", "display:none;");
                writer.Write(HtmlTextWriter.TagRightChar);
                writer.WriteEndTag("span");
            }

            base.Render(writer);
        }

        #endregion Protected members
    }
}