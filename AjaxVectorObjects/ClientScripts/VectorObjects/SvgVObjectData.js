// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a svg vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObjectData.initializeBase(this, [vObject]);
    if (vObject) {
        this.S = vObject.get_svg();
        this.SC = vObject.get_strokeColor()._get_data();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObjectData.applyState = function (svgData, vObject) {
    /// <summary>Applies the <paramref name="svgData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="svgData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_svg(svgData.S);
        vObject.set_strokeColor(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(svgData.SC));
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData.applyState(svgData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData);