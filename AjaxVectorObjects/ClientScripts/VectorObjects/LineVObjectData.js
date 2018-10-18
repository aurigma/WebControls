// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a line vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.W = vObject.get_width();
        this.C = vObject.get_color()._get_data();
        this.FW = vObject.get_fixedWidth();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData.applyState = function (lineData, vObject) {
    /// <summary>Applies the <paramref name="lineData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="lineData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_width(lineData.W);
        vObject.set_color(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(lineData.C));
        vObject.set_fixedWidth(lineData.FW);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData.applyState(lineData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData);