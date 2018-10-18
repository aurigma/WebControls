// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection = function () {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection`1" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a collection of items that can be accessed by index.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection`1" />
    /// <constructor>
    /// 	<summary>Creates and initializes an instance of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection" /> class.</summary>
    /// </constructor>
    this._collection = [];
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection.prototype = {
    indexOf: function (item) {
        /// <summary>Searches for the specified item and returns the zero-based index of the first occurrence within the entire collection.</summary>
        /// <param name="item" type="Type">The item to locate in the collection.</param>
        /// <returns type="Number">The zero-based index of the first occurrence of <paramref name="item" /> within the entire collection, if found; otherwise, -1.</returns>
        return Array.indexOf(this._collection, item);
    },

    contains: function (item) {
        /// <summary>Determines whether the specified item is in the collection.</summary>
        /// <param name="item" type="Type">The item to locate in the collection.</param>
        /// <returns type="Boolean"><strong>true</strong> if <paramref name="item" /> is found in the collection; otherwise, <strong>false</strong>.</returns>
        return Array.contains(this._collection, item);
    },

    addRange: function (items) {
        /// <summary>Adds the specified items to the end of the collection.</summary>
        /// <param name="item" type="Array">The array of items to be added to the end of the collection.</param>
        for (var i = 0; i < items.length; i++)
            this.add(items[i]);
    },

    add: function (item) {
        /// <summary>Adds the specified item to the end of the collection.</summary>
        /// <param name="item" type="Type">The item to be added to the end of the collection.</param>
        this.insert(this._collection.length, item);
    },

    push: function (item) {
        /// <summary>Pushes the specified item to the collection.</summary>
        /// <param name="item" type="Type">The item to push.</param>
        this.add(item);
    },

    insert: function (index, item) {
        /// <summary>Inserts the specified item into the collection at the specified index.</summary>
        /// <param name="index" type="Number">The zero-based index at which item should be inserted.</param>
        /// <param name="item" type="Type">The item to insert.</param>
        this._checkIfItemExists(item);
        if (index < 0 || index > this._collection.length)
            throw Error.argumentOutOfRange("index", index);
        Array.insert(this._collection, index, item);
        this._onItemAdded(index, item);
    },

    remove: function (item) {
        if (!this.contains(item))
            throw Error.argument("item", Aurigma.GraphicsMill.AjaxControls.VectorObjects.Exceptions.itemNotFoundInCollection);

        return this.removeAt(this.indexOf(item));
    },

    removeAt: function (index) {
        /// <summary>Removes the item at the specified index of the collection.</summary>
        /// <param name="index" type="Number">The zero-based index of the item to remove.</param>
        if (index < 0 || index > this._collection.length - 1)
            throw Error.argumentOutOfRange("index", index);

        var item = this._collection[index];
        this._collection.splice(index, 1);
        this._onItemRemoved(index, item);
        return item;
    },

    move: function (oldIndex, newIndex, supressEvent) {
        /// <summary>Moves an item from one position to another.</summary>
        /// <param name="oldIndex" type="Number">The zero-based index of the item to move.</param>
        /// <param name="newIndex" type="Number">The zero-based index to move the item to.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection`1.Move(System.Int32,System.Int32)">Collection.Move(Int32, Int32)</see> server-side member.</para></remarks>
        if (!(typeof supressEvent == "boolean"))
            supressEvent = false;

        var item = this._collection[oldIndex];
        if (item && oldIndex >= 0 && newIndex >= 0 && oldIndex != newIndex) {
            this._collection.splice(oldIndex, 1);
            Array.insert(this._collection, newIndex, item);

            if (!supressEvent)
                this._onItemMoved(oldIndex, newIndex);
        }
        return item;
    },

    clear: function () {
        /// <summary>Removes all items from the collection.</summary>
        for (var cnt = this.get_count() - 1, i = cnt; i >= 0; i--) {
            this.removeAt(i);
        }
    },

    get_count: function () {
        /// <summary>Gets the number of items actually contained in the collection.</summary>
        /// <value type="Number">The number of items actually contained in the collection.</value>
        return this._collection.length;
    },

    get_item: function (index) {
        /// <summary>Gets the item at the specified index.</summary>
        /// <param name="index" type="Number">The zero-based index of the item to get.</param>
        /// <value type="Type">The item at the specified index.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection`1.Item(System.Int32)">Item(Int32)</see> server-side member.</para></remarks>
        return this._collection[index];
    },

    toArray: function () {
        return this._collection.slice();
    },

    _checkIfItemExists: function (item) {
        if (Array.contains(this._collection, item)) {
            throw Error.argument("item",
				Aurigma.GraphicsMill.AjaxControls.VectorObjects.Exceptions.itemBelongsCollection);
        }
    },

    _onItemAdded: function (index, item) {
        var h = this.get_events().getHandler("ItemAdded");
        if (h)
            h(this, { item: item, index: index });
    },

    add_itemAdded: function (h) {
        /// <summary>Fires when the an item is added to the collection.</summary>
        this.get_events().addHandler("ItemAdded", h);
    },

    remove_itemAdded: function (h) {
        this.get_events().removeHandler("ItemAdded", h);
    },

    _onItemRemoved: function (index, item) {
        var h = this.get_events().getHandler("ItemRemoved");
        if (h)
            h(this, { item: item, index: index });
    },

    add_itemRemoved: function (h) {
        /// <summary>Fires when the an item is removed from the collection.</summary>
        this.get_events().addHandler("ItemRemoved", h);
    },

    remove_itemRemoved: function (h) {
        this.get_events().removeHandler("ItemRemoved", h);
    },

    _onItemMoved: function (oldIndex, newIndex) {
        var h = this.get_events().getHandler("ItemMoved");
        if (h)
            h(this, { oldIndex: oldIndex, newIndex: newIndex });
    },

    add_itemMoved: function (h) {
        /// <summary>Fires when the an item is moved from one position to another.</summary>
        this.get_events().addHandler("ItemMoved", h);
    },

    remove_itemMoved: function (h) {
        this.get_events().removeHandler("ItemMoved", h);
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection", Sys.Component);