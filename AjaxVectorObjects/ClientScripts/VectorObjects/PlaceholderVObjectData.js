// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a placeholder vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    // turn off editing to serialize actual permissions
    var editing = vObject._editing;
    if (editing)
        vObject._editing = false;
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObjectData.initializeBase(this, [vObject]);
    vObject._editing = editing;

    if (vObject) {
        if (!vObject.isEmptyContent()) {
            var data = new Aurigma.GraphicsMill.AjaxControls.VectorObjects[vObject.get_content()._get_dataType()](vObject.get_content());
            data.__type = vObject.get_content()._get_dataType();
            this.CD = JSON.stringify(data);
            this.CT = vObject.get_content()._get_type();
        } else {
            this.CD = null;
            this.CT = null;
        }

        this.SMC = vObject.get_showMaskedContent();
        this.ISC = vObject.get_isStubContent();
    }
}

// This method applies saved state (deserialized from string) to an object.
Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObjectData.applyState = function (placeholderData, vObject) {
    /// <summary>Applies the <paramref name="placeholderData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="placeholderData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class

        if (placeholderData.CT != null && placeholderData.CD != null) {
            var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
            var content = ns.ObjectFactory.createObjectByType(placeholderData.CT, ns);
            content.set_data(placeholderData.CD);
            vObject.set_content(content);
        } else {
            vObject.set_content(null);
        }

        vObject.set_showMaskedContent(placeholderData.SMC);
        vObject.set_isStubContent(placeholderData.ISC);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData.applyState(placeholderData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData);