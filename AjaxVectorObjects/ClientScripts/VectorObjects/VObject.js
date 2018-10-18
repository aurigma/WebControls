// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
/// <reference name="MicrosoftAjax.js" />
/// <reference path="~/ClientScripts/Math/PointF.js" />
/// <reference path="~/ClientScripts/Math/RectangleF.js" />
/// <reference path="~/ClientScripts/Math/RotatedRectangleF.js" />
/// <reference path="~/ClientScripts/Math/Common.js" />
/// <reference path="~/ClientScripts/VectorObjects/VObjectAction.js" />

Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject = function () {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This is a base class for all the AJAX vector objects.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.initializeBase(this);

    this.ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
    this._visible = true;
    this._locked = false;
    this._name = "";
    this._controlPoints = [];
    this._transformChangedDelegate = null;
    this._layer = null;
    this._tag = null;
    this._permissions = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission({
        NoPrint: false,
        NoShow: false
    }, true);
    //use current time to generate unique id
    //use this id for matching between server and cliebt objects
    this._uniqueId = this._createUniqueID();

    //set default transform
    this._initTransform();

    this._callbacks = [];
    this._activeCanvasIndex = -1;

    this._isCallingService = false;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.prototype = {
    _createUniqueID: function () {
        return ("vo" + new Date().getTime()) + Math.round(Math.random() * 1000);
    },

    clone: function () {
        var clonedObject = new this.constructor();

        var clonedObjId = clonedObject.get_uniqueId();

        clonedObject.set_data(this.get_data());

        clonedObject.set_uniqueId(clonedObjId);

        return clonedObject;
    },

    get_ready: function () {
        /// <summary>Check if VObject is ready.
        /// The property considered to be internal.</summary>
        /// <value type="Boolean"></value>        
        return true;
    },

    isLoadingImage: function () {
        /// <summary>Detemine is process of loading image for object from server, is in progress</summary>
        /// <value type="Boolean"></value>

        return false;
    },

    get_uniqueId: function () {
        /// <summary>Gets or sets a unique identifier of this vector object.</summary>
        /// <value type="String">The string which represents a unique identifier of this vector object.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.UniqueId">VObject.UniqueId</see> server-side member.</para></remarks>
        return this._uniqueId;
    },

    //use only for deserialization
    set_uniqueId: function (v) {
        this._uniqueId = v;
    },

    get_controlPoints: function () {
        /// <summary>Gets or sets an array of control points associated with the v-object.</summary>
        /// <value type="Array">An array of control points.</value>
        return this._controlPoints;
    },

    set_controlPoints: function (v) {
        this._controlPoints = v;
        this.raiseChanged();
    },

    get_permissions: function () {
        return this._permissions;
    },

    set_permissions: function (v) {
        this._permissions = v;
        this.raiseChanged();
    },

    get_transform: function () {
        /// <summary>Gets or sets value which configures v-object transformation.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform" /> class instance which provides an access to properties which configure v-object transformation.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Transform">VObject.Transform</see> server-side member.</para></remarks>
        return this._transform;
    },

    set_transform: function (v, supressOnChanged) {
        if (!this._transform.isEqual(v)) {
            //clear event handlers
            this._transform.remove_transformChanged(this._transformChangedDelegate);

            this._transform = v;
            this._transform.add_transformChanged(this._transformChangedDelegate);

            if (!supressOnChanged)
                this._transformChanged();
        }
    },

    _transformChanged: function () {
        this.raiseChanged();
    },

    get_tag: function () {
        /// <summary>Gets or sets custom data.</summary>
        /// <value type="Object">The value which represents a piece of custom data.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Tag">VObject.Tag</see> server-side member.</para></remarks>
        return this._tag;
    },

    set_tag: function (v) {
        this._tag = v;
        this.raiseChanged();
    },

    get_supportedActions: function () {
        /// <summary>Gets or sets the enumeration of actions which can be applied to this vector object.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction" /> enumeration which lists available actions.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.SupportedActions">VObject.SupportedActions</see> server-side member.</para></remarks>
        return this._permissions.toActions();
    },

    set_supportedActions: function (value) {
        this._permissions.fromActions(value);
        this.raiseChanged();
    },

    get_canvas: function () {
        /// <summary>Gets a reference to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> object this vector object belongs to.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> this vector object belongs to.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Canvas">VObject.Canvas</see> server-side member.</para></remarks>
        return (this._layer) ? this._layer.get_canvas() : null;
    },

    get_layer: function () {
        /// <summary>Gets a reference to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer" /> object this vector object belongs to.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer" /> this vector object belongs to.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Layer">VObject.Layer</see> server-side member.</para></remarks>
        return this._layer;
    },

    get_index: function () {
        /// <summary>Get the index of this v-object in the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection" />. Returns <c>-1</c> if the v-object was not added to the collection.</summary>
        /// <value type="Number">The index of this vector object.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Index">VObject.Index</see> server-side member.</para></remarks>
        return (this._layer) ? this._layer.get_vObjects().indexOf(this) : -1;
    },

    get_bounds: function () {
        /// <summary>Gets the size and location (in points) of this v-object relatively to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> it belongs to.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF">The rectangle relative to the canvas that represents the size and location of the v-object.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Bounds">VObject.Bounds</see> server-side member.</para></remarks>
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(0, 0, 0, 0);
    },

    get_name: function () {
        /// <summary>Gets or sets the name of this vector object.</summary>
        /// <value type="String">The name of this v-object.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Name">VObject.Name</see> server-side member.</para></remarks>
        return this._name;
    },

    set_name: function (v) {
        this._name = v;
        this.raiseChanged();
    },

    _get_type: function () {
        var type = Object.getType(this).getName().split('.');
        type = type[type.length - 1];
        return type;
    },

    //get class name that contains data for serialization
    //don't forget override in derived classes
    _get_dataType: function () {
        return "VObjectData";
    },

    get_data: function () {
        /// <summary>Gets or sets serialized data of this v-object.</summary>
        /// <value type="String">The string which represents serialized data of this v-object.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Data">VObject.Data</see> server-side member.</para></remarks>
        var data = new Aurigma.GraphicsMill.AjaxControls.VectorObjects[this._get_dataType()](this);
        return JSON.stringify(data);
    },

    set_data: function (v) {
        //raise changed event in applyState method
        if (v && v != "") {
            var data;
            if (typeof v == "string")
                data = JSON.parse(v);
            else
                data = v;
            Aurigma.GraphicsMill.AjaxControls.VectorObjects[this._get_dataType()].applyState(data, this);
        }
    },

    _setNeedRedrawCanvasFlag: function (redrawAll) {
        var cv = this.get_canvas();
        if (cv) {
            if (redrawAll)
                cv._needCompleteRedraw = true;
            else
                cv._needRedraw = true;
        }
    },

    get_visible: function () {
        /// <summary>Gets or sets the value indicating if the v-object is visible.</summary>
        /// <value type="Boolean"><strong>true</strong> if the v-object is visible; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Visible">VObject.Visible</see> server-side member.</para></remarks>
        return this._visible;
    },

    set_visible: function (v) {
        if (this._visible !== v) {
            this._visible = v;
            this.raiseChanged();
        }
    },

    isVisible: function () {
        return this.get_visible() && !this.get_permissions().get_noShow() && this.get_layer() != null && this.get_layer().get_visible();
    },

    get_locked: function () {
        /// <summary>Gets or sets the value indicating if the v-object is locked.</summary>
        /// <value type="Boolean"><strong>true</strong> if the v-object is locked; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Locked">VObject.Locked</see> server-side member.</para></remarks>
        return this._locked;
    },

    set_locked: function (v) {
        if (this._locked !== v) {
            this._locked = v;
            this.raiseChanged();
        }
    },

    isLocked: function () {
        return this.get_locked() || this.get_layer() != null && this.get_layer().get_locked();
    },

    _onAddedOnCanvas: function (canvas) {
    },

    _onRemovedFromCanvas: function (canvas) {
    },

    processEvent: function (e) {
        /// <summary>Executes the specified event.</summary>
        /// <param name="e" type="Object">The event to execute.</param>
    },

    hitTest: function (point) {
        /// <summary>Determines whether the specified point is located inside this vector object.</summary>
        /// <param name="p" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The point to test.</param>
        /// <returns type="Boolean"><strong>true</strong> if the specified point is located inside this vector object; otherwise <strong>false</strong>.</returns>
    },

    draw: function (ctx) {
        /// <summary>Draws this vector object.</summary>
    },

    _updateColors: function () {
    },

    _updateColor: function (color, callback) {
        var success = Function.createDelegate(this, function (data) {
            if (typeof callback == "function") {
                var result = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(JSON.parse(data));
                callback(result);
            }
        });

        var failure = function (error) {
            if (window.console) {
                console.log("Fail updateColorByService");
                console.log(error);
            }
        };

        var data = JSON.stringify(color._get_data());
        this._callService("UpdateByColorData", data, success, failure);
    },

    quickUpdate: function () {
        //do nothing by default
    },

    update: function (beforeUpdate, afterUpdate) {
        /// <summary>this function calls server update function for this object (for example for update text).</summary>
        /// <param name="beforeUpdate" type="function">Before update callback</param>
        /// <param name="afterUpdate" type="function">After update callback</param>

        //do nothing by default
    },

    _validateBeforeCallService: function () {
        return true;
    },

    _update: function (additionalArgs, beforeUpdate, afterUpdate) {
        var success = Function.createDelegate(this, function (data) {
            this.set_data(data);
            this.quickUpdate();

            if (typeof afterUpdate == "function") {
                afterUpdate();
                this.raiseChanged();
            }
        });

        var failure = function (error) {
            if (window.console) {
                console.log("Fail updateByService");
                console.log(error);
            }
        };

        if (this.get_isUpdating()) {
            this._callbacks.push(beforeUpdate);
            return;
        }

        if (typeof beforeUpdate == "function")
            beforeUpdate();

        var vObjectData = new this.ns[this._get_dataType()](this);
        vObjectData.__type = this._get_dataType();
        var data = [JSON.stringify(vObjectData)];
        if (additionalArgs != null)
            data = data.concat(additionalArgs);

        if (this._validateBeforeCallService())
            this._callService("UpdateBy" + this._get_dataType(), data, success, failure);
        else
            this.raiseChanged();
    },

    _callService: function (methodName, data, success, failure) {
        var onSuccess = Function.createDelegate(this, function (data) {
            this._isCallingService = false;

            if (typeof success == "function")
                success(data);
        });

        var onFailure = function (error, userContext, methodName) {
            this._isCallingService = false;

            var xmlhttp = new XMLHttpRequest();
            if (error._statusCode == 500 && error._errorObject == undefined) {
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {// 4 = "loaded"
                        if (xmlhttp.status == 200)
                            call();
                        else if (window.console)
                            console.log("Fail retrieve XML data");
                    }
                };
                xmlhttp.open("GET", document.location.href, false);
                xmlhttp.setRequestHeader('If-Modified-Since', '0');
                xmlhttp.send();
            }
            else if (typeof failure == "function") {
                failure(error);
            }
        };

        var call = Function.createDelegate(this, function () {
            var canvas = this.get_canvas();
            if (canvas != null && canvas.get_isInitialized()) {
                var args = [canvas.get_data(true)];
                if (data != null)
                    args = args.concat(data);
                args = args.concat(onSuccess, onFailure);

                this._isCallingService = true;
                var service = this.ns.Service;
                service[methodName].apply(service, args);
            }
        });

        call();
    },

    endUpdate: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.callBaseMethod(this, "endUpdate");

        var modified = false;
        while (this._callbacks.length > 0) {
            var callback = this._callbacks.shift();
            if (typeof callback == "function") {
                callback();
                modified = true;
            }
        }

        if (modified)
            this.update();
    },

    updated: function () {
        /// <exclude />
        this.raiseChanged();
    },

    raiseChanging: function (params) {
        /// <summary>Fires the <see cref="E:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.changing" /> event.</summary>
        var handler = this.get_events().getHandler("changing");
        if (handler) {
            handler(this, params);
        }
    },

    raiseChanged: function (params) {
        /// <summary>Fires the <see cref="E:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.changed" /> event.</summary>
        if (!this.get_isUpdating()) {
            var handler = this.get_events().getHandler("changed");
            if (handler) {
                handler(this, params);
            }
            var cv = this.get_canvas();
            if (cv)
                cv._invokeServer(this, 'changed');
        }
    },

    add_ready: function (handler) {
        /// <summary>Fires when v-object's ready property sets to true.</summary>
        this.get_events().addHandler('ready', handler);
    },

    remove_ready: function (handler) {
        this.get_events().removeHandler('ready', handler);
    },

    // protected
    _dispatchReadyEvent: function () {
        var h = this.get_events().getHandler('ready');
        if (h) {
            h(this, Sys.EventArgs.Empty);
        }
    },

    add_changing: function (handler) {
        /// <summary>Fires before v-object is being modified (before the start of an operation).</summary>
        this.get_events().addHandler("changing", handler);
    },

    remove_changing: function (handler) {
        this.get_events().removeHandler("changing", handler);
    },

    add_changed: function (handler) {
        /// <summary>Fires when v-object was modified (after the end of an operation).</summary>
        this.get_events().addHandler("changed", handler);
    },

    remove_changed: function (handler) {
        this.get_events().removeHandler("changed", handler);
    },

    add_beforeCreate: function (handler) {
        /// <summary>Fires when v-object is about to be created.</summary>
        this.get_events().addHandler("beforeCreate", handler);
    },

    remove_beforeCreate: function (handler) {
        this.get_events().removeHandler("beforeCreate", handler);
    },

    initialize: function () {
        /// <summary>Initializes the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    },

    _initTransform: function () {
        this._transform = $create(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform);

        if (!this._transformChangedDelegate) {
            this._transformChangedDelegate = Function.createDelegate(this, this._transformChanged);
        }
        this._transform.add_transformChanged(this._transformChangedDelegate);
    },

    dispose: function () {
        /// <summary>Removes the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" /> from the application.</summary>
        if (this._transformChangedDelegate) {
            this._transform.remove_transformChanged(this._transformChangedDelegate);
            delete this._transformChangedDelegate;
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject", Sys.Component);