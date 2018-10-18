// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo
{
    internal class VObjectRemovedCommand : VObjectChangedCommand
    {
        public VObjectRemovedCommand(VObject vObject, int vobjectIndex, int layerIndex) : base(vObject, vobjectIndex, layerIndex)
        {
        }

        public VObjectRemovedCommand()
            : base()
        {
        }

        public override void Execute(ICanvas canvas)
        {
            this.Data = canvas.Layers[LayerIndex].VObjects[this.VObjectIndex].Data;
            canvas.Layers[LayerIndex].VObjects.RemoveAt(this.VObjectIndex);
        }

        public override void UnExecute(ICanvas canvas)
        {
            Object b = Activator.CreateInstance(Type.GetType(this.ClassName));
            VObject obj = (VObject)(b);
            obj.Data = this.Data;
            canvas.Layers[this.LayerIndex].VObjects.Insert(this.VObjectIndex, obj);
        }
    }
}