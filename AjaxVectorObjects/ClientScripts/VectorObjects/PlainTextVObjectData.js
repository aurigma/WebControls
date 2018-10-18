// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a text vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.BL = vObject.get_baselineLocation();
        this.AA = vObject.get_angle();
        this.T = { ScaleX: 1, ScaleY: 1, TranslateX: 0, TranslateY: 0, Angle: vObject.get_angle() };
        this.IV = vObject.get_isVertical();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObjectData.applyState = function (textData, vObject) {
    /// <summary>Applies the <paramref name="textData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="textData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_originalBaselineLocation(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(textData.BL.X, textData.BL.Y));
        vObject.set_actualAngle(textData.AA);
        vObject._isVertical = textData.IV;
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData.applyState(textData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData);