// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo
{
    internal class VObjectMovedCommand : Command
    {
        private int _oldVObjectIndex = -1;

        public int OldVObjectIndex
        {
            get { return _oldVObjectIndex; }
            set { _oldVObjectIndex = value; }
        }

        private int _newVObjectIndex = -1;

        public int NewVObjectIndex
        {
            get { return _newVObjectIndex; }
            set { _newVObjectIndex = value; }
        }

        private int _layerIndex = -1;

        public int LayerIndex
        {
            get { return _layerIndex; }
            set { _layerIndex = value; }
        }

        public VObjectMovedCommand(VObject vObject, int oldIndex, int newIndex, int layerIndex)
        {
            _oldVObjectIndex = oldIndex;
            _newVObjectIndex = newIndex;
            _layerIndex = layerIndex;
        }

        public VObjectMovedCommand()
        { }

        public override void Execute(ICanvas canvas)
        {
            canvas.Layers[this.LayerIndex].VObjects.Move(_oldVObjectIndex, _newVObjectIndex);
        }

        public override void UnExecute(ICanvas canvas)
        {
            canvas.Layers[this.LayerIndex].VObjects.Move(_newVObjectIndex, _oldVObjectIndex);
        }
    }
}