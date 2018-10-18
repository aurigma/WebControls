// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using Graphics = Aurigma.GraphicsMill.AdvancedDrawing.Graphics;
using PointF = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public abstract class VObject : ICloneable
    {
        private string _name;
        private bool _visible;
        private bool _locked;
        private Transform _transform;
        private IPermission _permissions;
        private object _tag;
        private string _uniqueId = "vo" + Guid.NewGuid().ToString("N");

        private readonly JsonVOSerializer _jsonSerializer = new JsonVOSerializer();

        protected VObject()
        {
            _visible = true;
            _locked = false;
            _name = "";
            _transform = new Transform();
            _transform.TransformChanged += Transform_TransformChanged;
            Permissions = new Permission
            {
                NoShow = false,
                NoPrint = false
            };
        }

        public object Clone()
        {
            var clonedObject = (VObject)Activator.CreateInstance(GetType());
            var clonedObjId = clonedObject.UniqueId;

            var data = Data;
            clonedObject.Data = data;
            clonedObject.UniqueId = clonedObjId;

            return clonedObject;
        }

        internal virtual PointF[] ControlPoints { get; set; }

        public string UniqueId
        {
            get { return _uniqueId; }
            set { _uniqueId = value; }
        }

        public Transform Transform
        {
            get
            {
                return _transform;
            }
            set
            {
                if (value == null)
                    throw ExceptionFactory.ArgumentNullException();

                if (Transform.AreEqualValues(_transform, value))
                    return;

                _transform = value;
                _transform.TransformChanged += Transform_TransformChanged;

                Transform_TransformChanged(_transform, EventArgs.Empty);
            }
        }

        public object Tag
        {
            get { return _tag; }
            set
            {
                if (_tag != value)
                {
                    _tag = value;
                    OnChanged();
                }
            }
        }

        protected internal virtual void Transform_TransformChanged(object sender, EventArgs e)
        {
            OnChanged();
        }

        [Browsable(true)]
        public event EventHandler Changed;

        protected virtual void OnChanged()
        {
            if (Changed != null && IsUpdating == false)
            {
                Changed(this, EventArgs.Empty);
            }
        }

        public abstract RectangleF Bounds { get; }

        public Layer Layer { get; internal set; }

        public int Index
        {
            get
            {
                if (Layer != null)
                    return Layer.VObjects.IndexOf(this);

                return -1;
            }
        }

        public ICanvas Canvas
        {
            get
            {
                return Layer != null ? Layer.Canvas : null;
            }
        }

        public string Name
        {
            get
            {
                return _name;
            }
            set
            {
                if (_name != value)
                {
                    _name = value;
                    OnChanged();
                }
            }
        }

        public IPermission Permissions
        {
            get
            {
                return _permissions;
            }
            set
            {
                if (_permissions != value)
                {
                    _permissions = value;
                    OnChanged();
                }
            }
        }

        public VObjectAction SupportedActions
        {
            get
            {
                return Permissions.ToActions();
            }
            set
            {
                Permissions.FromActions(value);
                OnChanged();
            }
        }

        public string Data
        {
            get
            {
                var colorManagement = GetColorManagement(true);
                if (colorManagement != null)
                    colorManagement.InitPreviewColorMap(GetColors());

                _jsonSerializer.ColorManagement = colorManagement;

                return _jsonSerializer.Serialize(GetVObjectData());
            }
            set
            {
                var type = Type.GetType(typeof(VObject).Namespace + "." + GetVObjectDataType());
                var d = (VObjectData)_jsonSerializer.Deserialize(value, type);
                d.ApplyState(this);
            }
        }

        public abstract VObjectData GetVObjectData();

        public abstract string GetVObjectDataType();

        internal abstract IEnumerable<Color> GetColors();

        public virtual bool Visible
        {
            get
            {
                return _visible;
            }
            set
            {
                if (_visible != value)
                {
                    _visible = value;
                    OnChanged();
                }
            }
        }

        public virtual bool Locked
        {
            get
            {
                return _locked;
            }
            set
            {
                if (_locked != value)
                {
                    _locked = value;
                    OnChanged();
                }
            }
        }

        internal float? TargetDpi
        {
            get { return Canvas != null ? Canvas.TargetDpi : null; }
        }

        public virtual void Draw(Bitmap bitmap)
        {
            var vObject = this as IPipelineExtender;
            if (vObject != null && vObject.CanExtendPipeline)
            {
                var addAlpha = false;
                if (!bitmap.PixelFormat.HasAlpha)
                {
                    bitmap.Channels.SetAlpha(1);
                    addAlpha = true;
                }

                IEnumerable<IDisposable> deps;
                var pipeline = new Pipeline(bitmap);
                var scale = bitmap.DpiX / TargetDpi ?? 1;
                vObject.ExtendPipeline(pipeline, bitmap, GetColorManagement(), scale, out deps);

                using (var newBitmap = new Bitmap())
                {
                    pipeline.Add(newBitmap);
                    pipeline.Run();
                    pipeline.Remove(bitmap);

                    Pipeline.Run(newBitmap + bitmap);
                }

                if (addAlpha)
                    bitmap.Channels.RemoveAlpha(ColorManagement.GetTransparentColor(bitmap.PixelFormat));

                pipeline.DisposeAllElements();

                if (deps != null)
                    foreach (var dep in deps)
                        dep.Dispose();
            }
            else
            {
                using (var graphics = bitmap.GetAdvancedGraphics())
                {
                    Draw(graphics, bitmap, GetColorManagement());
                }
            }
        }

        public virtual PipelineElement GetDrawer(IImageParams destImageParams, ColorManagement colorManagement)
        {
            var drawer = new Drawer();
            drawer.Draw += (sender, e) =>
            {
                Draw(e.Graphics, destImageParams, colorManagement);
            };

            return drawer;
        }

        internal abstract void Draw(Graphics graphics, IImageParams destImageParams, ColorManagement colorManagement);

        protected internal ColorManagement GetColorManagement(bool isPreview = false)
        {
            return Canvas != null ? Canvas.GetColorManagement(isPreview) : null;
        }

        internal virtual void OnAddedOnCanvas(ICanvas canvas)
        {
        }

        internal virtual void OnRemovedFromCanvas(ICanvas canvas)
        {
        }

        public bool IsUpdating { get; set; }

        public void BeginUpdate()
        {
            IsUpdating = true;
        }

        public void EndUpdate()
        {
            IsUpdating = false;
            OnChanged();
        }

        internal void RaiseChanged()
        {
            OnChanged();
        }

        public abstract void Accept(IVObjectVisitor visitor);
    }
}