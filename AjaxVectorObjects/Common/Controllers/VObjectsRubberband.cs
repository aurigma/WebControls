// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Web.UI;

namespace Aurigma.GraphicsMill.AjaxControls
{
    [System.Drawing.ToolboxBitmap(typeof(UserInputController), "Resources.RectangleRubberband.bmp")]
    [DefaultEvent("RectangleChanged")]
    public class VObjectsRubberband : UserInputController, IRubberband
    {
        public VObjectsRubberband()
        {
            Canvas canvas = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas();
            this.Controls.Add(canvas);
            this.ScriptClassName = "Aurigma.GraphicsMill.AjaxControls.VObjectsRubbeband";
        }

        protected override IEnumerable<ScriptReference> GetScriptReferences()
        {
            List<ScriptReference> list = new List<ScriptReference>();
            foreach (ScriptReference sr in base.GetScriptReferences())
            {
                list.Add(sr);
            }
            ScriptReference sref = new ScriptReference();
            sref.Assembly = Type.GetType("Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband").Assembly.FullName;
            sref.Name = Type.GetType("Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband").Assembly.GetName().Name + ".Resources.VObjectsRubberband.js";
            list.Add(sref);
            return list;
        }

        protected override void Connect(BaseViewer viewer)
        {
            base.Connect(viewer);
            this.Canvas.Zoom = viewer.Zoom;
        }

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
            descriptor.AddProperty("canvasID", this.Controls[0].ClientID);
            descriptor.Type = "Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband";
        }

        protected override void Render(HtmlTextWriter writer)
        {
            base.Render(writer);
            this.Controls[0].RenderControl(writer);
        }
    }
}