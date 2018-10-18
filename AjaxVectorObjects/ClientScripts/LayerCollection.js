// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
/// <reference name="MicrosoftAjax.js" />

Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection = function (canvas) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a collection of layers.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    if (!canvas)
        throw Error.argumentNull("canvas");
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.initializeBase(this);
    this._canvas = canvas;
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.prototype = {
    getLayerById: function (id) {
        for (var i = 0, imax = this.get_count() ; i < imax; i++) {
            var layer = this.get_item(i);
            if (layer.get_uniqueId() == id) {
                return layer;
            }
        }
        return null;
    },

    getLayersByName: function (name) {
        /// <summary>Search layers with the specified name.</summary>
        /// <param name="name" type="String">The name to search layers.</param>
        /// <returns type="Array">An array of layers contained in this collection and match the specified name.</returns>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.GetLayersByName(System.String)">LayerCollection.GetLayersByName(String)</see> server-side member.</para></remarks>
        var ll = [];
        for (var i = 0; i < this.get_count() ; i++) {
            if (this.get_item(i).get_name() == name) {
                ll.push(this.get_item(i));
            }
        }
        return ll;
    },

    getVObjectsByName: function (name) {
        /// <summary>Search v-objects with the specified name.</summary>
        /// <param name="name" type="String">The name to search v-objects.</param>
        /// <returns type="Array">An array of v-objects which match the specified name.</returns>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.GetVObjectsByName(System.String)">LayerCollection.GetVObjectsByName(String)</see> server-side member.</para></remarks>
        var ol = [];
        for (var i = 0; i < this.get_count() ; i++) {
            var l = this.get_item(i);
            for (var j = 0; j < l.get_vObjects().get_count() ; j++) {
                if (l.get_vObjects().get_item(j).get_name() == name) {
                    ol.push(l.get_vObjects().get_item(j));
                }
            }
        }
        return ol;
    },

    _onLayerRemoved: function (layer, index) {
        var cv = this._canvas;
        if (cv) {
            //add to history
            var history = cv.get_history();
            if (history.get_trackingEnabled()) {
                history.addLayerRemoved(layer, index);
            }

            for (var i = 0; i < cv.get_selectedVObjects().get_count() ; i++) {
                var vObject = cv.get_selectedVObjects().get_item(i);
                if (vObject != null && vObject.get_layer() != null && vObject.get_layer().get_uniqueId() == layer.get_uniqueId())
                    cv.removeSelectedVObject(vObject);
            }

            //set flag that redraw needed
            cv._needCompleteRedraw = true;

            //remove canvas property in layer
            layer._canvas = null;

            layer._onRemovedFromCanvas(cv)
        }
    },

    _onLayerAdded: function (layer, index) {
        var cv = this._canvas;
        if (cv) {
            var history = cv.get_history();
            if (history.get_trackingEnabled()) {
                history.addLayerAdded(layer, index);
            }

            //set canvas property in layer
            layer._canvas = cv;

            //set flag that redraw needed
            cv._needCompleteRedraw = true;

            layer._onAddedOnCanvas(cv);
        }
    },

    _onLayerMoved: function (layer, oldIndex, newIndex) {
        var cv = this._canvas;
        if (cv) {
            var history = cv.get_history();
            if (history.get_trackingEnabled()) {
                history.addLayerMoved(layer, oldIndex, newIndex);
            }

            //set flag that redraw needed
            cv._needCompleteRedraw = true;
        }
    },

    removeAt: function (index) {
        /// <summary>Removes the layer at the specified index of the collection.</summary>
        /// <param name="index" type="Number">The zero-based index of the layer to remove.</param>
        var item = this.get_item(index);
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.callBaseMethod(this, 'removeAt', [index]);
        this._onLayerRemoved(item, index);
    },

    insert: function (index, item) {
        /// <summary>Inserts a layer into the collection at the specified index.</summary>
        /// <param name="index" type="Number">A zero-based index at which a layer should be added.</param>
        /// <param name="item" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer">A layer to insert.</param>
        if (item._canvas) {
            throw Error.argument("item",
				Aurigma.GraphicsMill.AjaxControls.VectorObjects.Exceptions.itemBelongsCollection);
        }

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.callBaseMethod(this, 'insert', [index, item]);
        this._onLayerAdded(item, index);
    },

    move: function (oldIndex, newIndex) {
        /// <summary>Moves a layer from one position to another.</summary>
        /// <param name="oldIndex" type="Number">The zero-based index of the layer to move.</param>
        /// <param name="newIndex" type="Number">The zero-based index to move the layer to.</param>
        var item = Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.callBaseMethod(this, 'move', [oldIndex, newIndex]);
        if (item) {
            this._onLayerMoved(item, oldIndex, newIndex);
        }
        return item;
    },

    clear: function () {
        /// <summary>Removes all layers from the collection.</summary>
        var cnt = this.get_count();
        for (var i = 0; i < cnt; i++) {
            this.get_item(i)._canvas = null;
        }
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.callBaseMethod(this, "clear");
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection);