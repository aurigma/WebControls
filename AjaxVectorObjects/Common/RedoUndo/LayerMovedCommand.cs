// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo
{
    internal class LayerMovedCommand : Command
    {
        private int _oldLayerIndex = -1;
        private int _newLayerIndex = -1;

        public LayerMovedCommand(Layer layer, int oldIndex, int newIndex)
        {
            _oldLayerIndex = oldIndex;
            _newLayerIndex = newIndex;
        }

        public int OldLayerIndex
        {
            get { return _oldLayerIndex; }
            set { _oldLayerIndex = value; }
        }

        public int NewLayerIndex
        {
            get { return _newLayerIndex; }
            set { _newLayerIndex = value; }
        }

        public override void Execute(ICanvas canvas)
        {
            canvas.Layers.Move(this._oldLayerIndex, this._newLayerIndex);
        }

        public override void UnExecute(ICanvas canvas)
        {
            canvas.Layers.Move(this._newLayerIndex, this._oldLayerIndex);
        }
    }
}