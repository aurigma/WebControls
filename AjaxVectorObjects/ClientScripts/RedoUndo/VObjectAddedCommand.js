// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand = function (vObject, vObjectIndex, layerIndex) {
    /// <summary>This class represents the v-object added command.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand.initializeBase(this);

    this.VObjectIndex = -1;
    this.LayerIndex = -1;
    this.Data = "";
    this.ClassName = "";
    this.VObjectBoundData = null;
    this.VObjectId = "";
    if (vObject) {
        this.Data = vObject.get_data();
        this.ClassName = Object.getType(vObject).getName();
        this.VObjectId = vObject.get_uniqueId();
    }
    if (vObjectIndex || vObjectIndex == 0) {
        this.VObjectIndex = vObjectIndex;
    }
    if (layerIndex || layerIndex == 0) {
        this.LayerIndex = layerIndex;
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand.prototype = {
    /** @param {function(VObjectAddedCommand, VObject)} h*/
    add_vObjectRestored: function (h) {
        this.get_events().addHandler("vObjectRestored", h);
    },

    remove_vObjectRestored: function (h) {
        this.get_events().removeHandler("vObjectRestored", h);
    },

    /** @param {function(VObjectAddedCommand, VObject)} h*/
    add_vObjectDelete: function (h) {
        this.get_events().addHandler("vObjectDeleted", h);
    },

    remove_vObjectDelete: function (h) {
        this.get_events().removeHandler("vObjectDeleted", h);
    },

    execute: function (canvas, inGroup) {
        /// <summary>Executes this command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        var restoredVObject = Aurigma.GraphicsMill.AjaxControls.VectorObjects.ObjectFactory.createObjectByType(this.ClassName);
        restoredVObject.set_data(this.Data);
        restoredVObject.initialize();
        canvas.get_layers().get_item(this.LayerIndex).get_vObjects().insert(this.VObjectIndex, restoredVObject);

        var restoredEventHandler = this.get_events().getHandler("vObjectRestored");
        if (typeof restoredEventHandler == "function")
            restoredEventHandler(this, restoredVObject);

        if (!inGroup)
            canvas.updateTexts();

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand.callBaseMethod(this, 'execute');
    },

    unExecute: function (canvas, inGroup) {
        /// <summary>Rolls this command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        var objs = canvas.get_layers().get_item(this.LayerIndex).get_vObjects();
        var removingObject = objs.getVObjectById(this.VObjectId);

        var deletedEventHandler = this.get_events().getHandler("vObjectDeleted");
        if (typeof deletedEventHandler == "function")
            deletedEventHandler(this, removingObject);

        this.Data = removingObject.get_data();
        objs.remove(removingObject);

        if (!inGroup)
            canvas.updateTexts();

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand.callBaseMethod(this, 'unExecute');
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command);