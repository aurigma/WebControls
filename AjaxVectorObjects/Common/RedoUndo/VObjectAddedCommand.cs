// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo
{
    internal class VObjectAddedCommand : Command
    {
        private int _vObjectIndex;
        private int _layerIndex;
        private string _data;
        private string _className;
        private string _vObjectId;

        public VObjectAddedCommand(VObject vObject, int vObjectIndex, int layerIndex)
        {
            _vObjectIndex = vObjectIndex;
            _layerIndex = layerIndex;
            _data = vObject.Data;
            _className = vObject.GetType().FullName;
            _vObjectId = vObject.UniqueId;
        }

        public VObjectAddedCommand()
        {
            _vObjectIndex = -1;
            _layerIndex = -1;
            _data = "";
            _className = "";
            _vObjectId = "";
        }

        public int VObjectIndex
        {
            get
            {
                return _vObjectIndex;
            }
            set
            {
                _vObjectIndex = value;
            }
        }

        public int LayerIndex
        {
            get
            {
                return _layerIndex;
            }
            set
            {
                _layerIndex = value;
            }
        }

        public string Data
        {
            get
            {
                return _data;
            }
            set
            {
                _data = value;
            }
        }

        public string ClassName
        {
            get
            {
                return _className;
            }
            set
            {
                _className = value;
            }
        }

        public string VObjectId
        {
            get
            {
                return _vObjectId;
            }
            set
            {
                _vObjectId = value;
            }
        }

        public override void Execute(ICanvas canvas)
        {
            Object b = Activator.CreateInstance(Type.GetType(this.ClassName));
            VObject obj = (VObject)(b);
            obj.Data = this.Data;
            canvas.Layers[this.LayerIndex].VObjects.Insert(this.VObjectIndex, obj);
        }

        public override void UnExecute(ICanvas canvas)
        {
            this.Data = canvas.Layers[this.LayerIndex].VObjects[this.VObjectIndex].Data;
            canvas.Layers[this.LayerIndex].VObjects.RemoveAt(this.VObjectIndex);
        }
    }
}