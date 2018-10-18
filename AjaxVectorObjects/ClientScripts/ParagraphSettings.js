// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings = function (object) {
    if (object != null) {
        this.FirstLineIndent = (typeof object.FirstLineIndent == "number") ? object.FirstLineIndent : 0;
        this.SpaceAfter = (typeof object.SpaceAfter == "number") ? object.SpaceAfter : 0;
        this.SpaceBefore = (typeof object.SpaceBefore == "number") ? object.SpaceBefore : 0;
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings.prototype = {
    FirstLineIndent: 0,
    SpaceAfter: 0,
    SpaceBefore: 0,

    equals: function (settings) {
        return settings instanceof Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings &&
            this.FirstLineIndent === settings.FirstLineIndent &&
            this.SpaceAfter === settings.SpaceAfter &&
            this.SpaceBefore === settings.SpaceBefore;
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings");