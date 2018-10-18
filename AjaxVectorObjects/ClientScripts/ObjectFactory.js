// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ObjectFactory = function () {
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ObjectFactory.createObjectByType = function (type, ns) {
    if (!ns) {
        ns = window;
    }
    type = type.split('.');
    for (var i = 0, o = ns, imax = type.length; i < imax; i++) {
        o = o[type[i]];
    }
    return new o();
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ObjectFactory.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.ObjectFactory");