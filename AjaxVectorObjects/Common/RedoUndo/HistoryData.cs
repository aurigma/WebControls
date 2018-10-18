// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo
{
    [Serializable]
    public class HistoryTypeData
    {
        public HistoryTypeData()
            : this(null, null)
        { }

        public HistoryTypeData(string type, string data)
        {
            this.T = type;
            this.D = data;
        }

        public string T;
        public string D;
    }

    [Serializable]
    public class HistoryData
    {
        public HistoryData()
        {
            Cur = -1;
            E = false;
            L = false;
            T = true;
            US = 10;
            C = new List<HistoryTypeData>();
        }

        public HistoryData(History history)
        {
            Cur = history.Current;
            E = history.Enable;
            L = history.Locked;
            T = history.TrackingEnabled;
            US = history.MaxUndoStepCount;
            if (history.Commands != null)
            {
                C = new List<HistoryTypeData>();

                var serializer = new JsonVOSerializer();
                foreach (var command in history.Commands)
                {
                    HistoryTypeData data = null;
                    var unknownCommand = command as UnknownCommand;
                    if (unknownCommand != null)
                    {
                        data = new HistoryTypeData(unknownCommand.Type, unknownCommand.Data);
                    }
                    else if (command != null)
                    {
                        data = new HistoryTypeData(command.GetType().FullName,
                            serializer.Serialize(command));
                    }

                    if (data != null)
                    {
                        C.Add(data);
                    }
                }
            }
            else
            {
                C = new List<HistoryTypeData>();
            }
        }

        public void ApplyState(History history)
        {
            history.Current = Cur;
            history.Enable = E;
            history.Locked = L;
            history.MaxUndoStepCount = US;
            history.Commands.Clear();
            history.TrackingEnabled = T;
            for (int i = 0; i < C.Count; i++)
            {
                if (!String.IsNullOrEmpty(C[i].D))
                {
                    var serializer = new JsonVOSerializer();

                    Command command = null;
                    switch (C[i].T)
                    {
                        case "Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand":
                            command = serializer.Deserialize<RedoUndo.LayerAddedCommand>(C[i].D);
                            break;

                        case "Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand":
                            command = serializer.Deserialize<RedoUndo.LayerRemovedCommand>(C[i].D);
                            break;

                        case "Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand":
                            command = serializer.Deserialize<RedoUndo.LayerMovedCommand>(C[i].D);
                            break;

                        case "Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand":
                            command = serializer.Deserialize<RedoUndo.VObjectAddedCommand>(C[i].D);
                            break;

                        case "Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectChangedCommand":
                            command = serializer.Deserialize<RedoUndo.VObjectChangedCommand>(C[i].D);
                            break;

                        case "Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand":
                            command = serializer.Deserialize<RedoUndo.VObjectRemovedCommand>(C[i].D);
                            break;

                        case "Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand":
                            command = serializer.Deserialize<RedoUndo.VObjectMovedCommand>(C[i].D);
                            break;

                        default:
                            command = new UnknownCommand() { Type = C[i].T, Data = C[i].D };
                            break;
                    }

                    if (command != null)
                    {
                        history.Commands.Add(command);
                    }
                }
            }
        }

        /// <summary>
        /// TrackingEnabled
        /// </summary>
        public bool T { get; set; }

        /// <summary>
        /// MaxUndoStepCount
        /// </summary>
        public int US { get; set; }

        /// <summary>
        /// Commands
        /// </summary>
        public List<HistoryTypeData> C { get; set; }

        /// <summary>
        /// Enable
        /// </summary>
        public bool E { get; set; }

        /// <summary>
        /// Locked
        /// </summary>
        public bool L { get; set; }

        /// <summary>
        /// Current
        /// </summary>
        public int Cur { get; set; }
    }
}