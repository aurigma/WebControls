// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand = function (layer, index) {
    /// <summary>This class represents the layer removed command.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand.initializeBase(this, [layer, index]);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand.prototype = {
    execute: function (canvas) {
        /// <summary>Executes this command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand.callBaseMethod(this, 'unExecute', [canvas]);
    },

    unExecute: function (canvas) {
        /// <summary>Rolls this command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand.callBaseMethod(this, 'execute', [canvas]);
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand);