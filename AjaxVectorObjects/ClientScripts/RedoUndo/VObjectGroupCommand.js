// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand = function () {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand.initializeBase(this);

    this._commands = [];
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand.prototype = {
    execute: function (canvas) {
        var ru = Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo;
        for (var i = 0; i < this._commands.length; i++) {
            var command = this._commands[i];
            if (command && command.execute && command.unExecute) {
                command.execute(canvas, true);
            }
        }

        canvas.updateTexts();

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand.callBaseMethod(this, 'execute');
    },

    unExecute: function (canvas) {
        var ru = Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo;
        for (var i = this._commands.length - 1; i >= 0 ; i--) {
            var command = this._commands[i];
            if (command && command.execute && command.unExecute) {
                command.unExecute(canvas, true);
            }
        }

        canvas.updateTexts();

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand.callBaseMethod(this, 'unExecute');
    },

    addCommand: function (command) {
        this._commands.push(command);
    },

    isEmpty: function () {
        return this._commands.length == 0;
    },

    get_commands: function () {
        return this._commands;
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command);