// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo
{
    /// <summary>
    /// We may have commands, that implemented only on client side.
    /// And to be able to serialize and deserialize that command, the server does not know about,
    /// we use UnknownCommand as a generic storage for data, received from client.
    /// </summary>
    [Serializable]
    public class UnknownCommand : Command
    {
        public string Type { get; set; }

        public string Data { get; set; }

        public override void Execute(ICanvas canvas)
        {
            throw new NotSupportedException(string.Format("\"{0}\" command not supported on server-side.", Type));
        }

        public override void UnExecute(ICanvas canvas)
        {
            throw new NotSupportedException(string.Format("\"{0}\" command not supported on server-side.", Type));
        }
    }
}