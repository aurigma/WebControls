// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Drawing;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class Layer
    {
        private VObjectCollection _vObjectCollection;
        private string _name;

        public Layer()
        {
            _name = string.Empty;
            Visible = true;
            Locked = false;
            UniqueId = "l" + Guid.NewGuid().ToString("N");
        }

        public string Name
        {
            get { return _name; }
            set { _name = value ?? string.Empty; }
        }

        public string UniqueId { get; set; }

        public bool Visible { get; set; }

        public bool Locked { get; set; }

        public RectangleF? Region { get; set; }

        public ICanvas Canvas { get; internal set; }

        public VObjectCollection VObjects
        {
            get { return _vObjectCollection ?? (_vObjectCollection = new VObjectCollection(this)); }
        }

        public int Index
        {
            get { return Canvas != null ? Canvas.Layers.IndexOf(this) : -1; }
        }

        internal virtual void OnAddedOnCanvas(ICanvas cv)
        {
            foreach (var vo in VObjects)
            {
                vo.OnAddedOnCanvas(cv);
            }
        }

        internal virtual void OnRemovedFromCanvas(ICanvas cv)
        {
            foreach (var vo in VObjects)
            {
                vo.OnRemovedFromCanvas(cv);
            }
        }
    }
}