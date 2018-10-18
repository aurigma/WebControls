// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData = function (vObject) {
    ///	<summary>This is a base class for all the classes which represent a state of a vector object.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    /// <field name="Name" type="String" static="true"><summary>The name of the v-object.</summary></field>
    /// <field name="Visible" type="Boolean" static="true"><summary>The value indicating if the v-object is visible.</summary></field>
    /// <field name="Locked" type="Boolean" static="true"><summary>The value indicating if the v-object is locked.</summary></field>
    /// <field name="Tag" type="Array" static="true"><summary>The array of control points associated with the v-object.</summary></field>
    /// <field name="P" type="Object" static="true"><summary>The custom data.</summary></field>
    /// <field name="ID" type="String" static="true"><summary>The unique identifier of the v-object.</summary></field>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData.initializeBase(this);

    if (vObject) {
        this.N = vObject.get_name();
        this.V = vObject.get_visible();
        this.L = vObject.get_locked();
        this.P = vObject.get_controlPoints();
        this.Tg = vObject.get_tag();
        this.ID = vObject.get_uniqueId();
        var transform = vObject.get_transform();
        this.T = {
            ScaleX: transform.get_scaleX(), ScaleY: transform.get_scaleY(),
            TranslateX: transform.get_translateX(), TranslateY: transform.get_translateY(),
            Angle: transform.get_angle()
        };
        this.Prm = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.PermissionData(vObject.get_permissions());
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData.applyState = function (vObjectData, vObject) {
    /// <summary>Applies the <paramref name="vObjectData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="vObjectData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate();
        vObject.set_name(vObjectData.N);
        vObject.set_visible(vObjectData.V);
        vObject.set_locked(vObjectData.L);
        vObject.set_controlPoints(vObjectData.P);
        var transform = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform(
			vObjectData.T.ScaleX, vObjectData.T.ScaleY,
			vObjectData.T.TranslateX, vObjectData.T.TranslateY,
			vObjectData.T.Angle);
        vObject.set_transform(transform, true);
        vObject.set_tag(vObjectData.Tg);
        vObject.set_uniqueId(vObjectData.ID);
        vObject.set_permissions(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission(vObjectData.Prm));
        vObject.endUpdate();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData.prototype = {
    N: "",
    V: true,
    L: true,
    P: [],
    Tg: null,
    ID: ("vo" + new Date().getTime()) + Math.round(Math.random() * 1000),
    Prm: {}
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData", null);