// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObjectData = function (vObject) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.IV = vObject.get_isVertical();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObjectData.applyState = function (textData, vObject) {
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class

        vObject._isVertical = textData.IV;
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData.applyState(textData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData);