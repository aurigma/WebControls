// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand = function (layer, index) {
    /// <summary>This class represents the layer added command.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    this.LayerIndex = -1;
    this.LayerData = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData();
    if (layer) {
        this.LayerData = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData(layer);
    }
    if (index) {
        this.LayerIndex = index;
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand.prototype = {
    execute: function (canvas) {
        /// <summary>Executes this command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        var l = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer(canvas);
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData.applyState(this.LayerData, l);
        canvas.get_layers().insert(this.LayerIndex, l);

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand.callBaseMethod(this, 'execute');
    },

    unExecute: function (canvas) {
        /// <summary>Rolls this command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        this.LayerData = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData(canvas.get_layers().get_item(this.LayerIndex));
        canvas.get_layers().removeAt(this.LayerIndex);

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand.callBaseMethod(this, 'unExecute');
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command);