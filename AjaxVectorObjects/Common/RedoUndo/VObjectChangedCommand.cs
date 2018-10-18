// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo
{
    internal class VObjectChangedCommand : VObjectAddedCommand
    {
        public VObjectChangedCommand(VObject vObject, int vObjectIndex, int layerIndex) : base(vObject, vObjectIndex, layerIndex)
        {
        }

        public VObjectChangedCommand()
            : base()
        {
        }

        public override void Execute(ICanvas canvas)
        {
            // So, we assume that we can't call Execure or UnExecute twice.
            string d = canvas.Layers[this.LayerIndex].VObjects[this.VObjectIndex].Data;
            canvas.Layers[this.LayerIndex].VObjects[this.VObjectIndex].Data = this.Data;
            this.Data = d;
        }

        public override void UnExecute(ICanvas canvas)
        {
            // vice versa
            Execute(canvas);
        }
    }
}