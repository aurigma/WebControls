// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData = function (layerObject) {
    ///	<summary>This class represents a state of a layer and allows applying this state to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    /// <field name="Name" type="String" static="true"><summary>The name of the layer.</summary></field>
    /// <field name="Visible" type="Boolean" static="true"><summary>The value indicating if the layer is visible.</summary></field>
    /// <field name="Locked" type="Boolean" static="true"><summary>The value indicating if the layer is locked.</summary></field>
    /// <field name="UniqueId" type="String" static="true"><summary>The unique identifier of the layer.</summary></field>
    /// <field name="VObjects" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectrCollection" static="true"><summary>The collection of v-objects associated with this layer.</summary></field>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData.initializeBase(this);

    if (layerObject) {
        this.N = layerObject.get_name();
        this.V = layerObject.get_visible();
        this.L = layerObject.get_locked();
        this.R = layerObject.get_region();
        this.ID = layerObject.get_uniqueId();
        this.VO = [];
        var objs = layerObject.get_vObjects();
        for (var i = 0; i < objs.get_count() ; i++) {
            var vo = objs.get_item(i);
            var dt = new Aurigma.GraphicsMill.AjaxControls.VectorObjects[vo._get_dataType()](vo);
            dt.__type = vo._get_dataType();
            this.VO.push({ T: vo._get_type(), D: dt });
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData.applyState = function (layerData, layerObject, objectsHash) {
    /// <summary>Applies the <paramref name="layerData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer" />.</summary>
    /// <param name="layerData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData">The state to apply.</param>
    /// <param name="layerObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer">Layer to apply the state to.</param>
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
    if (!objectsHash)
        objectsHash = {};
    if (layerObject) {
        layerObject.set_name(layerData.N);
        layerObject.set_visible(layerData.V);
        layerObject.set_locked(layerData.L);
        layerObject.set_uniqueId(layerData.ID);
        if (layerData.R)
            layerObject.set_region(ns.Math.RectangleF.FromObject(layerData.R));
        var lvo = layerObject.get_vObjects();
        for (var i = 0; i < layerData.VO.length; i++) {
            var voData = layerData.VO[i].D;
            var a = objectsHash[voData.ID];
            if (!a) {
                a = ns.ObjectFactory.createObjectByType(layerData.VO[i].T, ns);
                a.set_data(voData);
                a.initialize();
            } else {
                //exclude VObject from hash
                objectsHash[voData.ID] = null;
                a.set_data(voData);
            }
            lvo.add(a);
        }
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData.prototype = {
    N: "",
    V: true,
    L: false,
    ID: ("l" + new Date().getTime()) + Math.round(Math.random() * 1000),
    VO: []
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData", null);