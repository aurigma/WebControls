// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo
{
    internal class LayerRemovedCommand : LayerAddedCommand
    {
        public LayerRemovedCommand() : base()
        {
        }

        public LayerRemovedCommand(Layer layer, int index)
            : base(layer, index)
        {
        }

        public override void Execute(ICanvas canvas)
        {
            this.LayerData = new LayerData(canvas.Layers[this.LayerIndex]);
            canvas.Layers.RemoveAt(this.LayerIndex);
        }

        public override void UnExecute(ICanvas canvas)
        {
            Layer l = new Layer();
            this.LayerData.ApplyState(l);
            canvas.Layers.Insert(this.LayerIndex, l);
        }
    }
}