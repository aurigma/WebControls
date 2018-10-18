// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData = function (vObject) {
    ///	<summary>This is a base class for all the classes which represent a state of a rectangle vector object.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.TWM = vObject.get_textWrappingMode();
        this.O = vObject.get_opacity();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData.applyState = function (rectangleData, vObject) {
    /// <summary>Applies the <paramref name="rectangleData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="rectangleData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_textWrappingMode(rectangleData.TWM);
        vObject.set_opacity(rectangleData.O);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData.applyState(rectangleData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData.registerClass(
	"Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData);