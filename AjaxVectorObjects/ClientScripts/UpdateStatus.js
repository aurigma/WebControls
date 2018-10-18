// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus = function () {
    /// <summary>Specifies a current bitmap status.</summary>
    /// <field name="ready" type="Number" integer="true" static="true"><summary>The remote scripting method has been completed (or was not run yet), and you can freely get return value or exception details.</summary></field>
    /// <field name="refresh" type="Number" integer="true" static="true"><summary>The control updates a portion of image it displays (e.g. when user zoomed or scrolled it). The bitmap state is not changed while status is "refresh". </summary></field>
    /// <field name="busy" type="Number" integer="true" static="true"><summary>The remote scripting method is running (the bitmap state is changing). </summary></field>
    throw Error.notImplemented();
};
Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus.prototype = {
    ready: 0,
    refresh: 1,
    busy: 2
};
Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus.registerEnum("Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus");