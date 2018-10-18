// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
/// <reference name="MicrosoftAjax.js" />

Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer = function () {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a layer.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.initializeBase(this);

    this._visible = true;
    this._locked = false;
    this._vObjects = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection(this);
    this._name = "";
    this._region = null;

    this._canvas = null;

    //use current time to generate unique id
    //use this id for matching between server and client objects
    this._uniqueId = ("l" + new Date().getTime()) + Math.round(Math.random() * 1000);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.prototype = {
    get_uniqueId: function () {
        /// <summary>Gets or sets a unique identifier of this layer.</summary>
        /// <value type="String">The string which represents a unique identifier of this layer.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.UniqueId">Layer.UniqueId</see> server-side member.</para></remarks>
        return this._uniqueId;
    },

    //use only for deserialization
    set_uniqueId: function (v) {
        this._uniqueId = v;
    },

    get_canvas: function () {
        /// <summary>Gets a reference to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> object this layer belongs to.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> this layer belongs to.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.Canvas">Layer.Canvas</see> server-side member.</para></remarks>
        return this._canvas;
    },

    get_index: function () {
        /// <summary>Get the index of this layer in the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection" />. Returns <c>-1</c> if the layer was not added to the collection.</summary>
        /// <value type="Number">The index of this layer.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.Index">Layer.Index</see> server-side member.</para></remarks>
        var cv = this.get_canvas();
        if (cv) {
            return cv.get_layers().indexOf(this);
        } else {
            return -1;
        }
    },

    get_data: function () {
        /// <summary>Gets or sets serialized data of this layer.</summary>
        /// <value type="String">The string which represents serialized data of this layer.</value>
        var data = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData(this);
        return JSON.stringify(data);
    },

    set_data: function (v) {
        if (v && v != "") {
            var data = JSON.parse(v);
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData.applyState(data, this);
        }
    },

    get_region: function () {
        /// <summary>Gets or sets the rectangle region on the layer surface in which v-objects can be placed.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.Math.RectangleF" /> in which v-objects can be placed.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.Region">Layer.Region</see> server-side member.</para></remarks>
        return this._region;
    },

    set_region: function (region) {
        this._region = region;
    },

    get_vObjects: function () {
        /// <summary>Gets a collection of vector objects associated with this layer.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection" /> which represents a collection of vector objects associated with this layer.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.VObjects">Layer.VObjects</see> server-side member.</para></remarks>
        return this._vObjects;
    },

    get_name: function () {
        /// <summary>Gets or sets the name of this layer.</summary>
        /// <value type="String">The name of this layer.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.Name">Layer.Name</see> server-side member.</para></remarks>
        return this._name;
    },

    set_name: function (v) {
        this._name = v;
    },

    get_visible: function () {
        /// <summary>Gets or sets the value indicating if the layer is visible.</summary>
        /// <value type="Boolean"><strong>true</strong> if the layer is visible; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.Visible">Layer.Visible</see> server-side member.</para></remarks>
        return this._visible;
    },

    set_visible: function (v) {
        if (this._visible !== v) {
            this._visible = v;

            if (this.get_visible()) {
                for (var i = 0; i < this.get_vObjects().get_count() ; i++) {
                    var vObject = this.get_vObjects().get_item(i);
                    if (Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject.isInstanceOfType(vObject) ||
	                    Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.isInstanceOfType(vObject))
                        vObject.update();
                }
            }

            if (this._canvas != null) {
                this._canvas._needCompleteRedraw = true;
                this._canvas.updatePlaceholderButtonGroups();
            }
        }
    },

    get_locked: function () {
        /// <summary>Gets or sets the value indicating if the layer is locked.</summary>
        /// <value type="Boolean"><strong>true</strong> if the layer is locked; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.Locked">Layer.Locked</see> server-side member.</para></remarks>
        return this._locked;
    },

    set_locked: function (v) {
        if (this._locked !== v) {
            this._locked = v;

            if (this._canvas != null) {
                this._canvas._needCompleteRedraw = true;
                this._canvas.updatePlaceholderButtonGroups();
            }
        }
    },

    _onRemovedFromCanvas: function (canvas) {
        var collection = this.get_vObjects();
        var count = collection.get_count();
        for (var i = 0; i < count; i++) {
            collection.get_item(i)._onRemovedFromCanvas(canvas);
        }
    },

    _onAddedOnCanvas: function (canvas) {
        var collection = this.get_vObjects();
        var count = collection.get_count();
        for (var i = 0; i < count; i++) {
            collection.get_item(i)._onAddedOnCanvas(canvas);
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer", Sys.Component);