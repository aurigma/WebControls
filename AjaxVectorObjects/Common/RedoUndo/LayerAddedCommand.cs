// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo
{
    internal class LayerAddedCommand : Command
    {
        private int _layerIndex;
        private LayerData _layerData;

        public LayerAddedCommand(Layer layer, int index)
        {
            _layerIndex = index;
            _layerData = new LayerData(layer);
        }

        public LayerAddedCommand()
        {
            _layerIndex = -1;
            _layerData = new LayerData();
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

        public LayerData LayerData
        {
            get
            {
                return _layerData;
            }
            set
            {
                _layerData = value;
            }
        }

        public override void Execute(ICanvas canvas)
        {
            Layer l = new Layer();
            this.LayerData.ApplyState(l);
            canvas.Layers.Insert(this.LayerIndex, l);
        }

        public override void UnExecute(ICanvas canvas)
        {
            this.LayerData = new LayerData(canvas.Layers[this.LayerIndex]);
            canvas.Layers.RemoveAt(this.LayerIndex);
        }
    }
}