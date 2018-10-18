// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData = function (vObject) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.MC = vObject.get_maskColor();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData.applyState = function (contentData, vObject) {
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class

        vObject.set_maskColor(contentData.MC);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData.applyState(contentData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData.registerClass(
	"Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData);