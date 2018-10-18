// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand = function (layer, oldLayerIndex, newLayerIndex) {
    /// <summary>This class represents the layer moved command.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    this.OldLayerIndex = new Number(oldLayerIndex);
    if (isNaN(this.OldLayerIndex))
        this.OldLayerIndex = -1;
    this.NewLayerIndex = new Number(newLayerIndex);
    if (isNaN(this.NewLayerIndex))
        this.NewLayerIndex = -1;
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand.prototype = {
    execute: function (canvas) {
        /// <summary>Executes this command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        canvas.get_layers().move(this.OldLayerIndex, this.NewLayerIndex);

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand.callBaseMethod(this, 'execute');
    },

    unExecute: function (canvas) {
        /// <summary>Rolls this command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        canvas.get_layers().move(this.NewLayerIndex, this.OldLayerIndex);

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand.callBaseMethod(this, 'unExecute');
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command);