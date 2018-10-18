// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public interface IPermission : ITransformPermission, IPlaceholderPermission, ICloneable
    {
        bool AllowDelete { get; set; }
        bool NoPrint { get; set; }
        bool NoShow { get; set; }

        bool Equals(IPermission other);

        void FromActions(VObjectAction action);

        VObjectAction ToActions();
    }
}