// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History = function (canvas) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a history of modifications applied to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> content.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    this._canvas = canvas;
    this._maxUndoStepCount = 10;
    this._current = -1;
    this._enable = false;
    this._locked = false;
    this._trackingEnabled = true;
    this._commands = [];
    this._events = null;
    this._overflowMaxUndoStepCount = false;

    this._vObjectGroupCommand = null;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.prototype = {
    get_events: function () {
        /// <summary>Returns a list of client events of this history.</summary>
        /// <value type="Sys.EventHandlerList">The <see cref="T:J:Sys.EventHandlerList" /> of this history.</value>
        if (!this._events) {
            this._events = new Sys.EventHandlerList();
        }
        return this._events;
    },

    get_enable: function () {
        /// <summary>Gets or sets the value indicating if the undo/redo functionality is enabled.</summary>
        /// <value type="Boolean"><strong>true</strong> if the undo/redo functionality is enabled; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.Enable">History.Enable</see> server-side member.</para></remarks>
        return this._enable;
    },

    set_enable: function (value) {
        if (!value) {
            this.clear();
        }
        this._enable = value;
    },

    get_locked: function () {
        /// <private />
        /// <exclude />
        return this._locked;
    },

    set_locked: function (value) {
        /// <private />
        this._locked = value;
    },

    get_trackingEnabled: function () {
        /// <summary>Gets or sets the value indicating if the tracking commands functionality is enabled.</summary>
        /// <value type="Boolean"><strong>true</strong> if the tracking commands functionality is enabled; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.TrackingEnabled">History.TrackingEnabled</see> server-side member.</para></remarks>
        return this._trackingEnabled;
    },

    set_trackingEnabled: function (value) {
        this._trackingEnabled = value;
    },

    pauseTracking: function () {
        this._prevTrackingState = this.get_trackingEnabled();

        if (this._prevTrackingState)
            this.set_trackingEnabled(false);
    },

    resumeTracking: function () {
        if (this._prevTrackingState === true)
            this.set_trackingEnabled(true);
    },

    get_maxUndoStepCount: function () {
        /// <summary>Gets or sets a maximum number of available undo steps.</summary>
        /// <value type="Number">The value which specifies a a maximum number of available undo steps.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.MaxUndoStepCount">History.MaxUndoStepCount</see> server-side member.</para></remarks>
        return this._maxUndoStepCount;
    },

    set_maxUndoStepCount: function (value) {
        this._maxUndoStepCount = value;
    },

    set_current: function (value) {
        /// <private />
        this._current = value;
    },

    get_current: function () {
        /// <private />
        /// <exclude />
        return this._current;
    },

    get_commands: function () {
        /// <private />
        /// <exclude />
        return this._commands;
    },

    set_commands: function (value) {
        /// <private />
        this._commands = value;
    },

    get_canvas: function () {
        /// <private />
        /// <exclude />
        return this._canvas;
    },

    get_canRedo: function () {
        /// <summary>Gets the value indicating if the last action can be redone.</summary>
        /// <value type="Boolean"><strong>true</strong> if the last action can be redone; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.CanRedo">History.CanRedo</see> server-side member.</para></remarks>
        return (this._current < this._commands.length - 1);
    },

    get_canUndo: function () {
        /// <summary>Gets the value indicating if the last action can be undone.</summary>
        /// <value type="Boolean"><strong>true</strong> if the last action can be undone; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.CanUndo">History.CanUndo</see> server-side member.</para></remarks>
        return (this._current >= 0);
    },

    _clearRedo: function () {
        this._commands.splice(this._current + 1, this._commands.length - (this._current + 1));
    },

    clearRedo: function () {
        /// <summary>Discards the redo history.</summary>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.ClearRedo">History.ClearRedo()</see> server-side member.</para></remarks>
        if (this.get_canRedo()) {
            this._clearRedo();
            this._raiseChanged();
        }
    },

    _clearUndo: function () {
        this._commands.splice(0, this._current + 1);
        this._current = -1;
        this._overflowMaxUndoStepCount = false;
    },

    clearUndo: function () {
        /// <summary>Discards the undo history.</summary>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.ClearUndo">History.ClearUndo()</see> server-side member.</para></remarks>
        if (this.get_canUndo()) {
            this._clearUndo();
            this._raiseChanged();
        }
    },

    clear: function (suppressOnChanged) {
        /// <summary>Discards the redo and undo history.</summary>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.Clear">History.Clear()</see> server-side member.</para></remarks>
        var cr = this.get_canRedo();
        if (cr)
            this._clearRedo();

        var cu = this.get_canUndo();
        if (cu)
            this._clearUndo();

        var overflow = this.get_overflowMaxUndoStepCount();
        if (overflow)
            this._overflowMaxUndoStepCount = false;

        if (!suppressOnChanged && (cr || cu || overflow)) {
            this._raiseChanged();
        }
    },

    get_overflowMaxUndoStepCount: function () {
        return this._overflowMaxUndoStepCount;
    },

    startVObjectGroupCommand: function () {
        this._vObjectGroupCommand = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand();
    },

    endVObjectGroupCommand: function () {
        if (this._vObjectGroupCommand != null && !this._vObjectGroupCommand.isEmpty()) {
            var command = this._vObjectGroupCommand;
            this._vObjectGroupCommand = null;
            this.addCommand(command);
        }
        else
            this._vObjectGroupCommand = null;
    },

    addCommand: function (command) {
        if (command && command.execute && command.unExecute) {
            this._addCommand(command);
        } else {
            throw new Error('Not a command');
        }
    },

    _addCommand: function (command) {
        if (!command)
            throw "Command can not be null";
        if (this.get_enable() && !this.get_locked() && command) {
            if (this._vObjectGroupCommand != null) {
                this._vObjectGroupCommand.addCommand(command);
            }
            else {
                if (this.get_canRedo())
                    this._clearRedo();
                this._commands.push(command);
                this._current++;
                if (this._current + 1 > this._maxUndoStepCount) {
                    this._commands.splice(0, 1);
                    this._current--;
                    this._overflowMaxUndoStepCount = true;
                }
                this._raiseChanged();
            }
        }
    },

    redo: function () {
        /// <summary>Redoes the last made change.</summary>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.Redo">History.Redo()</see> server-side member.</para></remarks>
        if (this.get_enable() && this.get_canRedo()) {
            this._locked = true;
            this._current += 1;
            var command = this._commands[this._current];
            command.execute(this._canvas);
            this._locked = false;
            this._raiseChanged();
            if (command.ClassName != "Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject")
                this.get_canvas().redraw(true);
        }
    },

    undo: function () {
        /// <summary>Undoes the last made change.</summary>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.Undo">History.Undo()</see> server-side member.</para></remarks>
        if (this.get_enable() && this.get_canUndo()) {
            this._locked = true;
            var command = this._commands[this._current];
            command.unExecute(this._canvas);
            this._current -= 1;
            this._locked = false;
            this._raiseChanged();
            if (command.ClassName != "Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject")
                this.get_canvas().redraw(true);
        }
    },

    _defaultVObjectChangedFactMethod: function (vObject, vObjectIndex, layerIndex) {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectChangedCommand(vObject, vObjectIndex, layerIndex);
    },

    _get_VObjectChangedFactMethod: function () {
        return typeof this.vObjectChangedFactMethod == "function" ? this.vObjectChangedFactMethod : this._defaultVObjectChangedFactMethod;
    },

    vObjectChangedFactMethod: null,

    addVObjectChanged: function (vObject, vObjectIndex, layerIndex) {
        /// <summary>Adds the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectChangedCommand" /> command to the history.</summary>
        /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">The v-object that was changed.</param>
        /// <param name="vObjectIndex" type="Number">An index of this v-object.</param>
        /// <param name="layerIndex" type="Number">An index of the layer this v-object belongs to.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.AddVObjectChanged(Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject,System.Int32,System.Int32)">History.AddVObjectChanged(VObject, Int32, Int32)</see> server-side member.</para></remarks>
        if (this.get_enable() && !this.get_locked()) {
            if ((!vObjectIndex) && vObjectIndex != 0) {
                vObjectIndex = vObject.get_index();
            }
            if ((!layerIndex) && layerIndex != 0) {
                layerIndex = vObject.get_layer().get_index();
            }
            var command = this._get_VObjectChangedFactMethod()(vObject, vObjectIndex, layerIndex);
            if ((command.LayerIndex > -1) && (command.VObjectIndex > -1)) {
                this._addCommand(command);
            }
        }
    },

    _defaultVObjectRemovedFactMethod: function (vObject, vObjectIndex, layerIndex) {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand(vObject, vObjectIndex, layerIndex);
    },

    _get_VObjectRemovedFactMethod: function () {
        return typeof this.vObjectRemovedFactMethod == "function" ? this.vObjectRemovedFactMethod : this._defaultVObjectRemovedFactMethod;
    },

    vObjectRemovedFactMethod: null,

    addVObjectRemoved: function (vObject, vObjectIndex, layerIndex) {
        /// <summary>Adds the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand" /> command to the history.</summary>
        /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">The v-object that was removed.</param>
        /// <param name="vObjectIndex" type="Number">An index of this v-object.</param>
        /// <param name="layerIndex" type="Number">An index of the layer this v-object belongs to.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.AddVObjectRemoved(Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject,System.Int32,System.Int32)">History.AddVObjectRemoved(VObject, Int32, Int32)</see> server-side member.</para></remarks>
        if (this.get_enable() && !this.get_locked()) {
            if ((!vObjectIndex) && vObjectIndex != 0) {
                vObjectIndex = vObject.get_index();
            }
            if ((!layerIndex) && layerIndex != 0 && vObject.get_layer()) {
                layerIndex = vObject.get_layer().get_index();
            }
            var command = this._get_VObjectRemovedFactMethod()(vObject, vObjectIndex, layerIndex);
            if ((command.LayerIndex > -1) && (command.VObjectIndex > -1)) {
                this._addCommand(command);
            }
        }
    },

    _defaultVObjectAddedFactMethod: function (vObject, vObjectIndex, layerIndex) {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand(vObject, vObjectIndex, layerIndex);
    },

    _get_VObjectAddedFactMethod: function () {
        return typeof this.vObjectAddedFactMethod == "function" ? this.vObjectAddedFactMethod : this._defaultVObjectAddedFactMethod;
    },

    vObjectAddedFactMethod: null,

    addVObjectAdded: function (vObject, vObjectIndex, layerIndex) {
        /// <summary>Adds the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand" /> command to the history.</summary>
        /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">The v-object that was added.</param>
        /// <param name="vObjectIndex" type="Number">An index of this v-object.</param>
        /// <param name="layerIndex" type="Number">An index of the layer this v-object belongs to.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.AddVObjectAdded(Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject,System.Int32,System.Int32)">History.AddVObjectAdded(VObject, Int32, Int32)</see> server-side member.</para></remarks>
        if (this.get_enable() && !this.get_locked()) {
            if ((!vObjectIndex) && vObjectIndex != 0) {
                vObjectIndex = vObject.get_index();
            }
            if ((!layerIndex) && layerIndex != 0) {
                layerIndex = vObject.get_layer().get_index();
            }
            var command = this._get_VObjectAddedFactMethod()(vObject, vObjectIndex, layerIndex);
            if ((command.LayerIndex > -1) && (command.VObjectIndex > -1)) {
                this._addCommand(command);
            }
        }
    },

    _defaultVObjectMovedFactMethod: function (vObject, oldVObjectIndex, newVObjectIndex, layerIndex) {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand(vObject, oldVObjectIndex, newVObjectIndex, layerIndex);
    },

    _get_VObjectMovedFactMethod: function () {
        return typeof this.vObjectMovedFactMethod == "function" ? this.vObjectMovedFactMethod : this._defaultVObjectMovedFactMethod;
    },

    vObjectMovedFactMethod: null,

    addVObjectMoved: function (vObject, oldVObjectIndex, newVObjectIndex, layerIndex) {
        /// <summary>Adds the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand" /> command to the history.</summary>
        /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">The v-object that was moved.</param>
        /// <param name="oldVObjectIndex" type="Number">An old index of this v-object.</param>
        /// <param name="newVObjectIndex" type="Number">A new index of this v-object.</param>
        /// <param name="layerIndex" type="Number">An index of the layer this v-object belongs to.</param>
        if (this.get_enable() && !this.get_locked()) {
            var command = this._get_VObjectMovedFactMethod()(vObject, oldVObjectIndex, newVObjectIndex, layerIndex);
            if (command.LayerIndex > -1 && command.NewVObjectIndex > -1 && command.OldVObjectIndex > -1) {
                this._addCommand(command);
            }
        }
    },

    addLayerRemoved: function (layer, index) {
        /// <summary>Adds the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand" /> command to the history.</summary>
        /// <param name="layer" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer">The layer which was removed.</param>
        /// <param name="index" type="Number">An index of this layer.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.AddLayerRemoved(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer,System.Int32)">History.AddLayerRemoved(Layer, Int32)</see> server-side member.</para></remarks>
        if (this.get_enable() && !this.get_locked()) {
            if ((!index) && index != 0)
                index = layer.get_index();
            var command = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand(layer, index);
            if (command.LayerIndex > -1) {
                this._addCommand(command);
            }
        }
    },

    addLayerAdded: function (layer, index) {
        /// <summary>Adds the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand" /> command to the history.</summary>
        /// <param name="layer" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer">The layer which was added.</param>
        /// <param name="index" type="Number">An index of this layer.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.AddLayerAdded(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer,System.Int32)">History.AddLayerAdded(Layer, Int32)</see> server-side member.</para></remarks>
        if (this.get_enable() && !this.get_locked()) {
            if ((!index) && index != 0)
                index = layer.get_index();
            var command = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand(layer, index);
            if (command.LayerIndex > -1) {
                this._addCommand(command);
            }
        }
    },

    addLayerMoved: function (layer, oldIndex, newIndex) {
        /// <summary>Adds the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand" /> command to the history.</summary>
        /// <param name="layer" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer">The layer which was added.</param>
        /// <param name="oldIndex" type="Number">An old index of this layer.</param>
        /// <param name="newIndex" type="Number">A new index of this layer.</param>
        if (this.get_enable() && !this.get_locked()) {
            var command = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand(layer, oldIndex, newIndex);
            if (command.NewLayerIndex > -1 && command.OldLayerIndex > -1) {
                this._addCommand(command);
            }
        }
    },

    _raiseChanged: function (args) {
        var h = this.get_events().getHandler("changed");
        if (h) {
            if (args == undefined) {
                args = Sys.EventArgs.Empty;
            }
            h(this, args);
        }
    },

    add_changed: function (h) {
        /// <summary>Fires when the history is changed.</summary>
        this.get_events().addHandler("changed", h);
    },

    remove_changed: function (h) {
        this.get_events().removeHandler("changed", h);
    },

    lockHistory: function (value) {
        var prevValue = this._locked;
        this._locked = value;
        return prevValue;
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History", null);