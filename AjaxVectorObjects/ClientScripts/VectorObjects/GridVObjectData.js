// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a dashed line vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.C = vObject.get_cols();
        this.R = vObject.get_rows();
        this.SX = vObject.get_stepX();
        this.SY = vObject.get_stepY();
        this.HLC = vObject.get_horizontalLineColor()._get_data();
        this.VLC = vObject.get_verticalLineColor()._get_data();
        this.LW = vObject.get_lineWidth();
        this.FLW = vObject.get_fixedLineWidth();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObjectData.applyState = function (gridData, vObject) {
    /// <summary>Applies the <paramref name="lineData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="lineData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_cols(gridData.C);
        vObject.set_rows(gridData.R);
        vObject.set_stepX(gridData.SX);
        vObject.set_stepY(gridData.SY);
        vObject.set_horizontalLineColor(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(gridData.HLC));
        vObject.set_verticalLineColor(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(gridData.VLC));
        vObject.set_lineWidth(gridData.LW);
        vObject.set_fixedLineWidth(gridData.FLW);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData.applyState(gridData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObjectData",
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData);