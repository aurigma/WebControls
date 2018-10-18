// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObjectData = function (vObject) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        var boundingPaths = vObject.get_boundingPaths();
        if (boundingPaths != null) {
            var paths = [];
            for (var i = 0; i < boundingPaths.length; i++) {
                paths.push(boundingPaths[i].toString());
            }
            this.BP = paths;
        } else
            this.BP = null;

        this.IV = vObject.get_isVertical();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObjectData.applyState = function (textData, vObject) {
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class

        if (textData.BP != null) {
            var paths = [];
            for (var i = 0; i < textData.BP.length; i++) {
                paths.push(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path(textData.BP[i]));
            }
            vObject._boundingPaths = paths;
        } else
            vObject._boundingPaths = null;

        vObject._isVertical = textData.IV;
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObjectData.applyState(textData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObjectData);