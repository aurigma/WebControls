// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand = function (vObject, oldVObjectIndex, newVObjectIndex, layerIndex) {
    /// <summary>This class represents the v-object moved command.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand.initializeBase(this);

    this.OldVObjectIndex = new Number(oldVObjectIndex);
    if (isNaN(this.OldVObjectIndex))
        this.OldVObjectIndex = -1;
    this.NewVObjectIndex = new Number(newVObjectIndex);
    if (isNaN(this.NewVObjectIndex))
        this.NewVObjectIndex = -1;
    this.LayerIndex = new Number(layerIndex);
    if (isNaN(this.LayerIndex))
        this.LayerIndex = -1;
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand.prototype = {
    execute: function (canvas, inGroup) {
        /// <summary>Executes this command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        canvas.get_layers().get_item(this.LayerIndex).get_vObjects().move(this.OldVObjectIndex, this.NewVObjectIndex);

        if (!inGroup)
            canvas.updateTexts();

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand.callBaseMethod(this, 'execute');
    },

    unExecute: function (canvas, inGroup) {
        /// <summary>Rolls this command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        canvas.get_layers().get_item(this.LayerIndex).get_vObjects().move(this.NewVObjectIndex, this.OldVObjectIndex);

        if (!inGroup)
            canvas.updateTexts();

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand.callBaseMethod(this, 'unExecute');
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command);