// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo
{
    public class History
    {
        private ICanvas _canvas;
        private List<Command> _commands;
        private int _current;
        private bool _enable;
        private bool _locked;
        private int _maxUndoStepCount;

        public History(ICanvas cv)
        {
            _canvas = cv;
            _commands = new List<Command>();
            _current = -1;
            _maxUndoStepCount = 10;
            _trackingEnabled = true;
            _enable = false;
            _locked = false;
        }

        private bool _trackingEnabled;

        public bool TrackingEnabled
        {
            get
            {
                return _trackingEnabled;
            }
            set
            {
                _trackingEnabled = value;
            }
        }

        public int MaxUndoStepCount
        {
            get
            {
                return _maxUndoStepCount;
            }
            set
            {
                _maxUndoStepCount = value;
            }
        }

        public bool Enable
        {
            get
            {
                return _enable;
            }
            set
            {
                if (!value)
                    Clear();
                _enable = value;
            }
        }

        internal bool Locked
        {
            get
            {
                return _locked;
            }
            set
            {
                _locked = value;
            }
        }

        internal int Current
        {
            get
            {
                return _current;
            }
            set
            {
                _current = value;
            }
        }

        internal List<Command> Commands
        {
            get
            {
                return _commands;
            }
            set
            {
                _commands = value;
            }
        }

        public bool CanRedo
        {
            get
            {
                return (_current < _commands.Count - 1);
            }
        }

        public bool CanUndo
        {
            get
            {
                return (_current >= 0);
            }
        }

        public void ClearRedo()
        {
            if (_current < _commands.Count - 1)
                _commands.RemoveRange(_current + 1, _commands.Count - _current - 1);
        }

        public void ClearUndo()
        {
            if (_current >= 0)
                _commands.RemoveRange(0, _current + 1);
            _current = -1;
        }

        public void Clear()
        {
            ClearRedo();
            ClearUndo();
        }

        private void AddCommand(Command command)
        {
            if (this.Enable && !this.Locked && command != null)
            {
                ClearRedo();
                _commands.Add(command);
                _current++;
                if (_current + 1 > this.MaxUndoStepCount)
                {
                    _commands.RemoveAt(0);
                    _current--;
                }
            }
        }

        public void Redo()
        {
            if (this.Enable && this.CanRedo)
            {
                _locked = true;
                _commands[++_current].Execute(_canvas);
                _locked = false;
            }
        }

        public void Undo()
        {
            if (this.Enable && this.CanUndo)
            {
                _locked = true;
                _commands[_current--].UnExecute(_canvas);
                _locked = false;
            }
        }

        public void AddVObjectChanged(VObject vObject, int vObjectIndex, int layerIndex)
        {
            if (this.Enable && !this.Locked)
            {
                VObjectChangedCommand command = new VObjectChangedCommand(vObject, vObjectIndex, layerIndex);
                if ((command.LayerIndex != -1) && (command.VObjectIndex != -1))
                {
                    AddCommand(command);
                }
            }
        }

        public void AddVObjectRemoved(VObject vObject, int vObjectIndex, int layerIndex)
        {
            if (this.Enable && !this.Locked)
            {
                VObjectRemovedCommand command = new VObjectRemovedCommand(vObject, vObjectIndex, layerIndex);
                if ((command.LayerIndex != -1) && (command.VObjectIndex != -1))
                {
                    AddCommand(command);
                }
            }
        }

        public void AddVObjectAdded(VObject vObject, int vObjectIndex, int layerIndex)
        {
            if (this.Enable && !this.Locked)
            {
                VObjectAddedCommand command = new VObjectAddedCommand(vObject, vObjectIndex, layerIndex);
                if ((command.LayerIndex != -1) && (command.VObjectIndex != -1))
                {
                    AddCommand(command);
                }
            }
        }

        public void AddLayerRemoved(Layer layer, int index)
        {
            if (this.Enable && !this.Locked)
            {
                LayerRemovedCommand command = new LayerRemovedCommand(layer, index);
                if (command.LayerIndex != -1)
                {
                    AddCommand(command);
                }
            }
        }

        public void AddLayerAdded(Layer layer, int index)
        {
            if (this.Enable && !this.Locked)
            {
                LayerAddedCommand command = new LayerAddedCommand(layer, index);
                if (command.LayerIndex != -1)
                {
                    AddCommand(command);
                }
            }
        }

        internal void AddLayerMoved(Layer layer, int oldIndex, int newIndex)
        {
            if (this.Enable && !this.Locked)
            {
                LayerMovedCommand command = new LayerMovedCommand(layer, oldIndex, newIndex);
                if (command.NewLayerIndex != -1 && command.OldLayerIndex != -1)
                {
                    AddCommand(command);
                }
            }
        }

        internal void AddVObjectMoved(VObject vObject, int oldIndex, int newIndex, int layerIndex)
        {
            if (this.Enable && !this.Locked)
            {
                VObjectMovedCommand command = new VObjectMovedCommand(vObject, oldIndex, newIndex, layerIndex);
                if (command.NewVObjectIndex != -1 && command.OldVObjectIndex != -1 && command.LayerIndex != -1)
                {
                    AddCommand(command);
                }
            }
        }
    }
}