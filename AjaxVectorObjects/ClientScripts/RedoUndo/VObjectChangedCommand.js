// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectChangedCommand = function (vObject, vObjectIndex, layerIndex) {
    /// <summary>This class represents the v-object changed command.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectChangedCommand.initializeBase(this, [vObject, vObjectIndex, layerIndex]);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectChangedCommand.prototype = {
    execute: function (canvas, inGroup) {
        // So, we assume that we can't call Execure or UnExecute twice.
        /// <summary>Executes this command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        var obj = canvas.get_layers().get_item(this.LayerIndex).get_vObjects().getVObjectById(this.VObjectId);
        var d = obj.get_data();
        obj.set_data(this.Data);
        this.Data = d;

        if (!inGroup)
            canvas.updateTexts(obj);

        obj.update();

        if (canvas.isVObjectSelected(obj))
            canvas.updateSelection();

        var executedHandler = this.get_events().getHandler("executed");
        if (typeof executedHandler == "function")
            executedHandler(this, { rollBack: false });
    },

    unExecute: function (canvas, inGroup) {
        // Vice versa
        /// <summary>Rolls this command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        this.execute(canvas, inGroup);

        var executedHandler = this.get_events().getHandler("executed");
        if (typeof executedHandler == "function")
            executedHandler(this, { rollBack: true });
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectChangedCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectChangedCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand);