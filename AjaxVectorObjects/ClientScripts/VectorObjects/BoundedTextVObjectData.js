// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a text vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.WR = vObject.get_wrappingRectangles();
        this.WM = vObject.get_wrappingMargin();
        this.PS = vObject.get_paragraphSettings();
        this.VA = vObject.get_verticalAlignment();
        this.IV = vObject.get_isVertical();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObjectData.applyState = function (textData, vObject) {
    /// <summary>Applies the <paramref name="textData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="textData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class

        var rectangles = [];
        for (var i = 0; i < textData.WR.length; i++) {
            var r = textData.WR[i];
            rectangles.push(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF(
                r.CenterX, r.CenterY, r.Width, r.Height, r.Angle));
        }

        vObject._wrappingRectangles = rectangles;
        vObject._wrappingMargin = textData.WM;
        vObject._paragraphSettings = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings(textData.PS);
        vObject._verticalAlignment = textData.VA;
        vObject._isVertical = textData.IV;
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData.applyState(textData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData);