// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
/// <reference path="permissiondata.js" />
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission = function (options, defaultValue) {
    if (options == null)
        options = {};

    if (defaultValue == null)
        defaultValue = true;

    this._noPrint = options.NoPrint == null ? defaultValue : !!options.NoPrint;
    this._noShow = options.NoShow == null ? defaultValue : !!options.NoShow;
    this._allowDelete = options.AllowDelete == null ? defaultValue : !!options.AllowDelete;

    this._allowMoveHorizontal = options.AllowMoveHorizontal == null ? defaultValue : !!options.AllowMoveHorizontal;
    this._allowMoveVertical = options.AllowMoveVertical == null ? defaultValue : !!options.AllowMoveVertical;
    this._allowRotate = options.AllowRotate == null ? defaultValue : !!options.AllowRotate;
    this._allowProportionalResize = options.AllowProportionalResize == null ? defaultValue : !!options.AllowProportionalResize;
    this._allowArbitraryResize = options.AllowArbitraryResize == null ? defaultValue : !!options.AllowArbitraryResize;

    this._allowEditContent = options.AllowEditContent == null ? defaultValue : !!options.AllowEditContent;
    this._showEditButton = options.ShowEditButton == null ? defaultValue : !!options.ShowEditButton;
    this._showSelectButton = options.ShowSelectButton == null ? defaultValue : !!options.ShowSelectButton;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission.prototype =
{
    toActions: function () {
        var action = Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction;
        var result = action.none;

        if (this._allowArbitraryResize)
            result |= action.arbitraryResize;

        if (this._allowProportionalResize)
            result |= action.proportionalResize;

        if (this._allowMoveHorizontal)
            result |= action.dragX;

        if (this._allowMoveVertical)
            result |= action.dragY;

        if (this._allowRotate)
            result |= action.rotate;

        return result;
    },
    fromActions: function (value) {
        var action = Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction;

        this._allowArbitraryResize = (value & action.arbitraryResize) === action.none;
        this._allowArbitraryResize = (value & action.proportionalResize) === action.none;
        this._allowMoveHorizontal = (value & action.dragX) === action.none;
        this._allowMoveVertical = (value & action.dragY) === action.none;
        this._allowRotate = (value & action.rotate) === action.none;
    },

    clone: function () {
        var obj = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission();

        for (var property in this) {
            if (this.hasOwnProperty(property)) {
                obj[property] = this[property];
            }
        }

        return obj;
    },

    get_allowDelete: function () {
        return this._allowDelete;
    },
    set_allowDelete: function (value) {
        this._allowDelete = value;
    },

    get_noPrint: function () {
        return this._noPrint;
    },
    set_noPrint: function (value) {
        this._noPrint = value;
    },

    get_noShow: function () {
        return this._noShow;
    },
    set_noShow: function (value) {
        this._noShow = value;
    },

    get_allowMoveHorizontal: function () {
        return this._allowMoveHorizontal;
    },
    set_allowMoveHorizontal: function (value) {
        this._allowMoveHorizontal = value;
    },

    get_allowMoveVertical: function () {
        return this._allowMoveVertical;
    },
    set_allowMoveVertical: function (value) {
        this._allowMoveVertical = value;
    },

    get_allowRotate: function () {
        return this._allowRotate;
    },
    set_allowRotate: function (value) {
        this._allowRotate = value;
    },

    get_allowProportionalResize: function () {
        return this._allowProportionalResize;
    },
    set_allowProportionalResize: function (value) {
        this._allowProportionalResize = value;
    },

    get_allowArbitraryResize: function () {
        return this._allowArbitraryResize;
    },
    set_allowArbitraryResize: function (value) {
        this._allowArbitraryResize = value;
    },

    get_allowResize: function () {
        return this._allowProportionalResize || this._allowArbitraryResize;
    },

    get_allowFreeMove: function () {
        return this._allowMoveHorizontal && this._allowMoveVertical;
    },

    get_allowMove: function () {
        return this._allowMoveHorizontal || this._allowMoveVertical;
    },

    get_allowEditContent: function () {
        return this._allowEditContent;
    },
    set_allowEditContent: function (value) {
        this._allowEditContent = value;
    },

    get_showEditButton: function () {
        return this._showEditButton;
    },
    set_showEditButton: function (value) {
        this._showEditButton = value;
    },

    get_showSelectButton: function () {
        return this._showSelectButton;
    },
    set_showSelectButton: function (value) {
        this._showSelectButton = value;
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission");