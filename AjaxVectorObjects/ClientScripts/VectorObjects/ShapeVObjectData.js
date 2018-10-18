// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData = function (vObject) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.Pth = vObject.get_originalPath().toString();
        this.BW = vObject.get_borderWidth();
        this.BC = vObject.get_borderColor()._get_data();
        this.FC = vObject.get_fillColor()._get_data();
        this.FBW = vObject.get_fixedBorderWidth();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData.applyState = function (shapeData, vObject) {
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_originalPath(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path(shapeData.Pth));
        vObject.set_borderWidth(shapeData.BW);
        vObject.set_borderColor(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(shapeData.BC));
        vObject.set_fillColor(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(shapeData.FC));
        vObject.set_fixedBorderWidth(shapeData.FBW);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData.applyState(shapeData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData);