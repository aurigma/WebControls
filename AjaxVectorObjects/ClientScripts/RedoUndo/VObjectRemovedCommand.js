// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand = function (vObject, vObjectIndex, layerIndex) {
    /// <summary>This class represents the v-object removed command.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand.initializeBase(this, [vObject, vObjectIndex, layerIndex]);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand.prototype = {
    execute: function (canvas, inGroup) {
        /// <summary>Executes this command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand.callBaseMethod(this, 'unExecute', [canvas, inGroup]);
    },

    unExecute: function (canvas, inGroup) {
        /// <summary>Rolls this command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand.callBaseMethod(this, 'execute', [canvas, inGroup]);
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand);