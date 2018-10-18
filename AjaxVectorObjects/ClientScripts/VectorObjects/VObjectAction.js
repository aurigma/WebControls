// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction = function () {
    /// <summary>Contains v-object actions.</summary>
    /// <field name="all" type="Number" integer="true" static="true"><summary>Enables all the actions.</summary></field>
    /// <field name="arbitraryResize" type="Number" integer="true" static="true"><summary>The arbitrary resize action. If this action in supported by the object, the user will be able to resize it without preserving the aspect ratio.</summary></field>
    /// <field name="drag" type="Number" integer="true" static="true"><summary>The drag action. If this action in supported by the object, the user will be able to move it.</summary></field>
    /// <field name="none" type="Number" integer="true" static="true"><summary>Disables all the actions.</summary></field>
    /// <field name="proportionalResize" type="Number" integer="true" static="true"><summary>The proportional resize action. If this action in supported by the object, the user will be able to resize it preserving the aspect ratio.</summary></field>
    /// <field name="resize" type="Number" integer="true" static="true"><summary>The resize action. If this action in supported by the object, the user will be able to resize it.</summary></field>
    /// <field name="rotate" type="Number" integer="true" static="true"><summary>The rotate action. If this action in supported by the object, the user will be able to rotate it.</summary></field>
    throw Error.notImplemented();
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction.prototype = {
    none: 0,
    dragX: 1,
    arbitraryResize: 2,
    proportionalResize: 4,
    rotate: 8,
    dragY: 16,
    all: 1 | 2 | 4 | 8 | 16,
    resize: 2 | 4,
    drag: 1 | 16
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction.registerEnum("Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction", true);