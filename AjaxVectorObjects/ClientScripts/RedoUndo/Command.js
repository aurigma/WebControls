// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command = function () {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This is a base class for all client-side commands.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command" />
    /// <constructor>
    ///		<exclude />
    /// </constructor>
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command.prototype = {
    get_events: function () {
        /// <summary>Returns a list of client events of this history.</summary>
        /// <value type="Sys.EventHandlerList">The <see cref="T:J:Sys.EventHandlerList" /> of this history.</value>
        if (!this._events) {
            this._events = new Sys.EventHandlerList();
        }
        return this._events;
    },

    /** @param {function(Command, {rollBack: boolean})} h*/
    add_executed: function (h) {
        this.get_events().addHandler("executed", h);
    },

    remove_executed: function (h) {
        this.get_events().removeHandler("executed", h);
    },

    execute: function (canvas, inGroup) {
        /// <summary>Executes a command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        var executedHandler = this.get_events().getHandler("executed");
        if (typeof executedHandler == "function")
            executedHandler(this, { rollBack: false });
    },

    unExecute: function (canvas, inGroup) {
        /// <summary>Rolls the command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        var executedHandler = this.get_events().getHandler("executed");
        if (typeof executedHandler == "function")
            executedHandler(this, { rollBack: true });
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command", null);