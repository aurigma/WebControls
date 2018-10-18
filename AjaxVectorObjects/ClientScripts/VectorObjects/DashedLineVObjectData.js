// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a dashed line vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.AC = vObject.get_altColor()._get_data();
        this.DW = vObject.get_dashWidth();
        this.ADW = vObject.get_altDashWidth();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObjectData.applyState = function (lineData, vObject) {
    /// <summary>Applies the <paramref name="lineData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="lineData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_altColor(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(lineData.AC));
        vObject.set_dashWidth(lineData.DW);
        vObject.set_altDashWidth(lineData.ADW);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData.applyState(lineData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObjectData",
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData);