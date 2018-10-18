// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection = function (layer) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a collection of v-objects.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    if (!layer)
        throw Error.argumentNull("layer");
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.initializeBase(this);
    this._layer = layer;
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.prototype = {
    getVObjectById: function (id) {
        for (var i = 0; i < this.get_count() ; i++) {
            var vObject = this.get_item(i);
            if (vObject.get_uniqueId() == id) {
                return vObject;
            }
        }
        return null;
    },

    getVObjectsByName: function (name) {
        /// <summary>Search v-objects with the specified name.</summary>
        /// <param name="name" type="String">The name to search v-objects.</param>
        /// <returns type="Array">An array of v-objects which match the specified name.</returns>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.GetVObjectsByName(System.String)">VObjectCollection.GetVObjectsByName(String)</see> server-side member.</para></remarks>
        var lvo = [];
        for (var i = 0; i < this.get_count() ; i++) {
            if (this.get_item(i).get_name() == name) {
                lvo.push(this.get_item(i));
            }
        }
        return lvo;
    },

    _onVObjectRemoved: function (vObject, vObjectIndex, layerIndex) {
        //add to history
        var cv = this._layer.get_canvas();
        if (cv) {
            var history = cv.get_history();
            if (history.get_trackingEnabled()) {
                history.addVObjectRemoved(vObject, vObjectIndex, layerIndex);
            }

            if (cv.isVObjectSelected(vObject)) {
                cv.removeSelectedVObject(vObject);
            }

            //set flag that redraw needed
            cv._needCompleteRedraw = true;
        }

        vObject._layer = null;

        //tell to vObject is has been removed from canvas
        if (cv)
            vObject._onRemovedFromCanvas(cv);
    },

    _onVObjectAdded: function (vObject, vObjectIndex, layerIndex) {
        vObject._layer = this._layer;
        var cv = this._layer.get_canvas();
        if (cv) {
            var history = cv.get_history();
            if (history.get_trackingEnabled()) {
                history.addVObjectAdded(vObject, vObjectIndex, layerIndex);
            }

            //tell to vObject it is has been added on canvas
            if (this._layer._canvas)
                vObject._onAddedOnCanvas(this._layer._canvas);

            //set flag that redraw needed
            cv._needCompleteRedraw = true;
        }
    },

    _onVObjectMoved: function (vObject, oldIndex, newIndex) {
        var cv = this._layer.get_canvas();
        if (cv) {
            var layerIndex = this._layer.get_index();
            var history = cv.get_history();
            if (history.get_trackingEnabled()) {
                history.addVObjectMoved(vObject, oldIndex, newIndex, layerIndex);
            }

            //set flag that redraw needed
            cv._needCompleteRedraw = true;
        }
    },

    insert: function (index, item) {
        /// <summary>Inserts a v-object into the collection at the specified index.</summary>
        /// <param name="index" type="Number">A zero-based index at which a v-object should be added.</param>
        /// <param name="item" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">A v-object to insert.</param>
        if (item._layer) {
            throw Error.argument("item",
				Aurigma.GraphicsMill.AjaxControls.VectorObjects.Exceptions.itemBelongsCollection);
        }
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.callBaseMethod(this, 'insert', [index, item]);
        this._onVObjectAdded(item, index, this._layer.get_index());
    },

    removeAt: function (index) {
        /// <summary>Removes the v-object at the specified index of the collection.</summary>
        /// <param name="index" type="Number">A zero-based index of the v-object to remove.</param>
        var layerIndex = this._layer.get_index();
        var item = this.get_item(index);
        if (item) {
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.callBaseMethod(this, 'removeAt', [index]);
            this._onVObjectRemoved(item, index, layerIndex);
        }
    },

    move: function (oldIndex, newIndex) {
        /// <summary>Moves a v-object from one position to another.</summary>
        /// <param name="oldIndex" type="Number">A zero-based index of the v-object to move.</param>
        /// <param name="newIndex" type="Number">A zero-based index to move the v-obejct to.</param>
        /// <returns type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" /> that was moved.</returns>
        var item = Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.callBaseMethod(this, 'move', [oldIndex, newIndex]);
        if (item) {
            this._onVObjectMoved(item, oldIndex, newIndex);
        }
        return item;
    },

    clear: function () {
        /// <summary>Removes all v-objects from the collection.</summary>
        var cnt = this.get_count();
        for (var i = 0; i < cnt; i++) {
            this.get_item(i)._layer = null;
        }
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.callBaseMethod(this, "clear");
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection);