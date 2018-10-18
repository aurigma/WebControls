// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData = function (history) {
    ///	<summary>This class represents a state of a history and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    this.Cur = -1;
    this.E = false;
    this.L = false;
    this.US = 10;
    this.T = true;
    this.C = [];
    if (history) {
        this.Cur = history.get_current();
        this.E = history.get_enable();
        this.L = history.get_locked();
        this.US = history.get_maxUndoStepCount();
        this.T = history.get_trackingEnabled();
        this.C = [];
        var commands = history.get_commands();
        for (var i = 0; i < commands.length; i++) {
            var command = commands[i];
            var type = Object.getType(command).getName();
            var data = "";
            if (type == "Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand" && !command.isEmpty()) {
                var groupCommand = {};
                groupCommand._commands = [];
                for (var j = 0; j < command.get_commands().length; j++) {
                    var c = command.get_commands()[j];
                    var t = Object.getType(c).getName();
                    var d = JSON.stringify(c);
                    groupCommand._commands.push({ D: d, T: t });
                }
                data = JSON.stringify(groupCommand);
            }
            else {
                data = JSON.stringify(commands[i]);
            }

            this.C.push({ D: data, T: type });
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData.applyState = function (historyData, history) {
    /// <summary>Applies the <paramref name="historyData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History" />.</summary>
    /// <param name="historyData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData">The state to apply.</param>
    /// <param name="history" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData">History to apply the state to.</param>
    if (!historyData) {
        return;
    }
    history.set_current(historyData.Cur);
    history.set_enable(historyData.E);
    history.set_locked(historyData.L);
    history.set_maxUndoStepCount(historyData.US);
    history.set_trackingEnabled(historyData.T);
    history.set_commands([]);
    for (var i = 0; i < historyData.C.length; i++) {
        if (historyData.C[i].D) {
            var type = historyData.C[i].T;
            var data = JSON.parse(historyData.C[i].D);
            var command = Aurigma.GraphicsMill.AjaxControls.VectorObjects.ObjectFactory.createObjectByType(type);

            if (type == "Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand" && data._commands.length > 0) {
                for (var j = 0; j < data._commands.length; j++) {
                    var t = data._commands[j].T;
                    var d = JSON.parse(data._commands[j].D);
                    var c = Aurigma.GraphicsMill.AjaxControls.VectorObjects.ObjectFactory.createObjectByType(t);
                    for (memberName in d) {
                        c[memberName] = d[memberName];
                    }
                    command.addCommand(c);
                }
            }
            else {
                for (memberName in data) {
                    command[memberName] = data[memberName];
                }
            }

            history.get_commands().push(command);
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData", null);