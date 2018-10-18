// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SelectionHandler = function (canvas) {
    this._canvas = canvas;

    this._multipleSelectionEnabled = false;

    this._currentVObject = null;
    this._vObjects = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection();

    this._rectangle = null;
    this._rubberband = null;
    this._region = null;

    this._needRedraw = false;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SelectionHandler.prototype = {
    get_multipleSelectionEnabled: function () {
        return this._multipleSelectionEnabled;
    },

    set_multipleSelectionEnabled: function (value) {
        this._multipleSelectionEnabled = value;
    },

    get_currentVObject: function () {
        return this._currentVObject;
    },

    set_currentVObject: function (vObject) {
        if (vObject !== this.get_currentVObject()) {
            this._currentVObject = vObject;
            this._canvas._onCurrentVObjectChanged(vObject);
        }
    },

    get_selectedVObjects: function () {
        return this._vObjects;
    },

    set_selectedVObjects: function (vObjects) {
        this.clearSelectedVObjects();

        if (Object.prototype.toString.call(vObjects) === "[object Array]") {
            if (!this.get_multipleSelectionEnabled())
                vObjects.splice(1, vObjects.length - 1);

            for (var i = 0; i < vObjects.length; i++) {
                this.addSelectedVObject(vObjects[i]);
            }
        }
    },

    isVObjectSelected: function (vObject) {
        return this._vObjects.contains(vObject);
    },

    addSelectedVObject: function (vObject) {
        if (!this.get_multipleSelectionEnabled() && this._vObjects.get_count() > 0)
            this._vObjects.clear();

        for (var i = 0; i < this._vObjects.get_count() ; i++) {
            var vo = this._vObjects.get_item(i);
            if (this._canvas._isPlaceholder(vo)) {
                vo.set_editing(false);
            }
        }

        if (vObject != null)
            this._vObjects.push(vObject);

        this.set_currentVObject(vObject);
        this._canvas._needCompleteRedraw = true;
    },

    removeSelectedVObject: function (vObject) {
        this._vObjects.remove(vObject);

        if (this._canvas._isPlaceholder(vObject))
            vObject.set_editing(false);

        if (this._vObjects.get_count() > 0)
            this.set_currentVObject(this._vObjects.get_item(this._vObjects.get_count() - 1));
        else
            this.set_currentVObject(null);

        this._canvas._needCompleteRedraw = true;
    },

    clearSelectedVObjects: function () {
        for (var i = 0; i < this._vObjects.get_count() ; i++) {
            var vo = this._vObjects.get_item(i);
            if (this._canvas._isPlaceholder(vo)) {
                vo.set_editing(false);
            }
        }

        this._vObjects.clear();
        this.set_currentVObject(null);
        this._canvas._needCompleteRedraw = true;
    },

    get_rectangle: function () {
        if (this._rectangle == null)
            return null;

        var r = this._rectangle.clone();
        r.Width = Math.abs(r.Width);
        r.Height = Math.abs(r.Height);

        return r;
    },

    hitTest: function (point) {
        var rectangle = this.get_rectangle();
        if (rectangle == null) {
            var selection = this._canvas.getVObjectByHitTest(point) == null;
            return { selection: selection };
        }

        var result = this._canvas.hitTestSelection(rectangle, point);

        var permissions = this._get_permissions();
        result.rotate = result.rotate && permissions.get_allowRotate();

        if (result.resize) {
            var index = result.resizeIndex;

            var arbitraryResize = permissions.get_allowArbitraryResize();
            arbitraryResize = arbitraryResize && (index === 5 || index === 6 || index === 7 || index === 8);

            var proportionalResize = permissions.get_allowProportionalResize();
            proportionalResize = proportionalResize && (index === 1 || index === 2 || index === 3 || index === 4);

            result.arbitraryResize = arbitraryResize;
            result.proportionalResize = proportionalResize;
            result.resize = arbitraryResize || proportionalResize;
        }

        result.dragX = result.body && permissions.get_allowMoveHorizontal();
        result.dragY = result.body && permissions.get_allowMoveVertical();
        result.drag = result.dragX || result.dragY;

        return result;
    },

    get_cursor: function (point) {
        var ht = this.hitTest(point);
        var gc = Aurigma.GraphicsMill.Cursor;
        var permissions = this._get_permissions();
        if (ht.resize) {
            var angle = this._rectangle.Angle;
            var needToFlipCursor = angle >= 45 && angle < 135 || angle >= 225 && angle < 315;

            if (ht.resizeIndex === 1)
                return !needToFlipCursor ? gc.sizeNW : gc.sizeNE;
            else if (ht.resizeIndex === 2)
                return !needToFlipCursor ? gc.sizeNE : gc.sizeSE;
            else if (ht.resizeIndex === 3)
                return !needToFlipCursor ? gc.sizeSE : gc.sizeSW;
            else if (ht.resizeIndex === 4)
                return !needToFlipCursor ? gc.sizeSW : gc.sizeNW;
            else if (ht.resizeIndex === 5)
                return !needToFlipCursor ? gc.sizeW : gc.sizeN;
            else if (ht.resizeIndex === 6)
                return !needToFlipCursor ? gc.sizeN : gc.sizeE;
            else if (ht.resizeIndex === 7)
                return !needToFlipCursor ? gc.sizeE : gc.sizeS;
            else if (ht.resizeIndex === 8)
                return !needToFlipCursor ? gc.sizeS : gc.sizeW;
        }
        else if (ht.rotate)
            return gc.cross;
        else if (ht.body && (permissions.get_allowMoveHorizontal() || permissions.get_allowMoveVertical()))
            return gc.move;

        return gc.defaultCursor;
    },

    update: function () {
        if (this._vObjects.get_count() > 0) {
            if (this._vObjects.get_count() === 1) {
                this._rectangle = this._vObjects.get_item(0).get_selectionRectangle();
            }
            else if (this._vObjects.get_count() > 1) {
                var bounds = this._vObjects.get_item(0).get_bounds();
                var left = bounds.Left, top = bounds.Top, right = bounds.Right, bottom = bounds.Bottom;
                for (var i = 1; i < this._vObjects.get_count() ; i++) {
                    var b = this._vObjects.get_item(i).get_bounds();

                    left = Math.min(left, b.Left);
                    top = Math.min(top, b.Top);
                    right = Math.max(right, b.Right);
                    bottom = Math.max(bottom, b.Bottom);
                }

                this._rectangle = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.FromLTRB(left, top, right, bottom);
            }

            this._region = this._get_region();
        }
        else {
            this._rectangle = null;
            this._region = null;
        }
    },

    draw: function (ctx) {
        if (this._rubberband != null)
            this._canvas.drawRubberband(ctx, this._rubberband);
        else
            this._needRedraw = false;

        var rectangle = this.get_rectangle();
        if (rectangle == null || this._vObjects.get_count() === 0)
            return;

        if (this._vObjects.get_count() === 1) {
            var vObject = this._vObjects.get_item(0);
            if (this._canvas._isPlaceholder(vObject) && vObject.get_editing())
                this._canvas.drawSelection(ctx, vObject.get_rectangle(), {});
        } else {
            for (var i = 0; i < this._vObjects.get_count() ; i++) {
                this._canvas.drawSelection(ctx, this._vObjects.get_item(i).get_selectionRectangle(), {});
            }
        }

        var permissions = this._get_permissions();
        var opts = {
            rotate: permissions.get_allowRotate(),
            resize: (permissions.get_allowProportionalResize() || permissions.get_allowArbitraryResize()),
            arbitraryResize: permissions.get_allowArbitraryResize()
        };

        this._canvas.drawSelection(ctx, rectangle, opts);
    },

    processKeyEvent: function (e) {
        if (this._rectangle == null)
            return;

        var permissions = this._get_permissions();
        var allowMove = ((e.keyCode === Sys.UI.Key.left || e.keyCode === Sys.UI.Key.right) && permissions.get_allowMoveHorizontal() ||
        (e.keyCode === Sys.UI.Key.up || e.keyCode === Sys.UI.Key.down) && permissions.get_allowMoveVertical());

        if (!allowMove)
            return;

        if (e.type === "keydown") {
            if (!this._keyPushed && !e.altKey && !e.ctrlKey && !e.metaKey) {
                this._keyPushed = true;
                this._keyCode = e.keyCode;

                this._startTransform();

                this._move(e.keyCode);
            } else if (this._keyCode === e.keyCode) {
                this._move(e.keyCode);
            }
        } else if (e.type === "keyup") {
            if (this._keyPushed && this._keyCode === e.keyCode) {
                this._keyPushed = false;
                this._endTransform();
            }
        }
    },

    processMouseEvent: function (e) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        var pt = new ns.Math.PointF(e.x, e.y);

        if (e.type === "mousedown") {
            this._operation = this.hitTest(pt);
            this._startPoint = pt;
            this._startTransform();
            this._startRubberbandSelection();
        } else if (e.type === "mouseup") {
            this._endTransform(this._operation && this._operation.resize);
            this._endRubberbandSelection();
            delete this._startPoint;
            delete this._operation;
        } else if (e.type === "mousemove") {
            if (this._operation != null && this._startPoint != null) {
                if (this._operation.selection)
                    this._updateRubberband(pt);
                else if (this._operation.resize)
                    this._resize(pt);
                else if (this._operation.rotate)
                    this._rotate(pt, !(e.ctrlKey || e.metaKey));
                else if (this._operation.drag) {
                    var permissions = this._get_permissions();
                    var moveVertical = permissions.get_allowMoveVertical();
                    var moveHorizontal = permissions.get_allowMoveHorizontal();
                    var x = moveHorizontal ? e.x : this._startPoint.X;
                    var y = moveVertical ? e.y : this._startPoint.Y;
                    this._drag(new ns.Math.PointF(x, y));
                }
            }
        }
    },

    isResizing: function () {
        return this._operation && this._operation.resize;
    },

    _startTransform: function () {
        if (this._rectangle == null)
            return;

        this._startRectangle = this._rectangle.clone();

        for (var i = 0; i < this._vObjects.get_count() ; i++) {
            this._vObjects.get_item(i)._startTransform();
        }
    },

    _endTransform: function (resized) {
        if (this._rectangle == null)
            return;

        var changed = !this._rectangle.isEqual(this._startRectangle);
        var useGroupCommand = this._canvas.get_history().get_trackingEnabled() && changed && this._vObjects.get_count() > 1;

        if (useGroupCommand)
            this._canvas.get_history().startVObjectGroupCommand();

        for (var i = 0; i < this._vObjects.get_count() ; i++) {
            this._vObjects.get_item(i)._endTransform(changed);
            if (changed && resized)
                this._vObjects.get_item(i)._onResized();
        }

        if (useGroupCommand)
            this._canvas.get_history().endVObjectGroupCommand();

        if (changed)
            this._canvas.updateTexts();

        delete this._startRectangle;

        if (this._vObjects.get_count() === 1 && resized)
            this.update();

        if (changed)
            this._canvas.get_history()._raiseChanged();
    },

    _startRubberbandSelection: function () {
        if (this._canvas._viewer != null)
            this._canvas._viewer.ignoreDocumentClickOnce();
    },

    _endRubberbandSelection: function () {
        if (this._rubberband == null)
            return;

        var math = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        var rectangle = math.RectangleF.FromLTRB(this._rubberband.left, this._rubberband.top, this._rubberband.right, this._rubberband.bottom);

        if (!math.EqualsOfFloatNumbers(rectangle.Width, 0) && !math.EqualsOfFloatNumbers(rectangle.Height, 0)) {
            var selectedVObjects = [];
            var vObjects = this._canvas.get_allVObjects(true);
            for (var i = 0; i < vObjects.length; i++) {
                var vObject = vObjects[i];
                if (!vObject.isLocked() && rectangle.contains(vObject.get_rectangle().get_center()))
                    selectedVObjects.push(vObject);
            }

            this.set_selectedVObjects(selectedVObjects);
        }

        this._rubberband = null;
    },

    _updateRubberband: function (point) {
        if (!this.get_multipleSelectionEnabled() || this._startPoint == null)
            return;

        this._rubberband = {
            left: Math.min(this._startPoint.X, point.X),
            top: Math.min(this._startPoint.Y, point.Y),
            right: Math.max(this._startPoint.X, point.X),
            bottom: Math.max(this._startPoint.Y, point.Y)
        };

        this._needRedraw = true;
    },

    _resize: function (pt) {
        var t, r = this._rectangle.clone();
        // new width or height, depends on resize action
        var newDem = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(pt.X - this._startRectangle.CenterX, pt.Y - this._startRectangle.CenterY);
        newDem.rotate(-r.Angle);
        // old width or height, depends on resize action
        var oldDem = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(this._startPoint.X - this._startRectangle.CenterX, this._startPoint.Y - this._startRectangle.CenterY);
        oldDem.rotate(-r.Angle);
        // added width or height, depends on resize action
        var addedDem = newDem.translate(-oldDem.X, -oldDem.Y);
        //gripses values for multipli (choosing resize strategy)
        var cw = [0, -1, 1, 1, -1, -1, 0, 1, 0];
        var ch = [0, -1, -1, 1, 1, 0, -1, 0, 1];
        //word interpretation of gripses (movable anchors)
        var gripsDict = { left: 6, top: 5 };
        // 1 or -1 (for choosing plus or minus action)
        var signMultiplier = 1;

        if (!this._operation.arbitraryResize) {
            var dx = addedDem.X * cw[this._operation.resizeIndex] / this._startRectangle.Width;
            var dy = addedDem.Y * ch[this._operation.resizeIndex] / this._startRectangle.Height;

            var d = dx < dy ? dx : dy;

            addedDem.X = this._startRectangle.Width * d;
            addedDem.Y = this._startRectangle.Height * d;

            r.Width = this._startRectangle.Width + addedDem.X;
            r.Height = this._startRectangle.Height + addedDem.Y;
        } else {
            r.Width = this._startRectangle.Width + addedDem.X * cw[this._operation.resizeIndex];
            r.Height = this._startRectangle.Height + addedDem.Y * ch[this._operation.resizeIndex];

            if (this._operation.resizeIndex === gripsDict["left"] || this._operation.resizeIndex === gripsDict["top"]) {
                signMultiplier = -1;
            }
        }

        if (this._get_allowNegativeResize() || r.Width > 0 && r.Height > 0) {
            t = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(
                addedDem.X / 2 * cw[this._operation.resizeIndex], addedDem.Y / 2 * ch[this._operation.resizeIndex]);
            t.rotate(r.Angle);

            r.CenterX = this._startRectangle.CenterX + (t.X * signMultiplier);
            r.CenterY = this._startRectangle.CenterY + (t.Y * signMultiplier);
        } else {
            r.Width = Math.max(r.Width, 1);
            r.Height = Math.max(r.Height, 1);
        }

        this._updateRectangle(r);
    },

    _drag: function (point) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        var diff = new ns.Math.PointF(point.X - this._startPoint.X, point.Y - this._startPoint.Y);
        diff = this._constrainDiffToRegion(this._startRectangle.get_bounds(), diff);

        var r = this._rectangle.clone();
        r.CenterX = this._startRectangle.CenterX + diff.X;
        r.CenterY = this._startRectangle.CenterY + diff.Y;
        this._updateRectangle(r);
    },

    _rotate: function (pt, angleSnap) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects,
            p1 = pt.clone(),
            p2 = this._startPoint,
            r = this._rectangle.clone(),
            p3 = new ns.Math.PointF(r.CenterX, r.CenterY),
            angle = ns.Math.getTriangleAngle(p1, p2, p3),
            edge = angleSnap ? 90 : -1;

        angle = ns.Math.normalizeAngle(this._startRectangle.Angle + angle);
        var mod = angle % edge;
        if (mod < 5) {
            angle = edge * Math.floor(angle / edge);
        } else if (mod > edge - 5) {
            angle = edge * Math.floor(angle / edge + 1);
        }
        angle = ns.Math.normalizeAngle(angle);

        r.Angle = angle;
        this._updateRectangle(r);
    },

    _move: function (key) {
        var delta = 1 / this._canvas._get_mul();
        var diff = null;
        switch (key) {
            case Sys.UI.Key.up:
                diff = { X: 0, Y: -delta };
                break;
            case Sys.UI.Key.down:
                diff = { X: 0, Y: delta };
                break;
            case Sys.UI.Key.left:
                diff = { X: -delta, Y: 0 };
                break;
            case Sys.UI.Key.right:
                diff = { X: delta, Y: 0 };
                break;
        }

        if (diff != null) {
            diff = this._constrainDiffToRegion(this._rectangle.get_bounds(), diff);

            var r = this._rectangle.clone();
            r.CenterX += diff.X;
            r.CenterY += diff.Y;
            this._updateRectangle(r);
        }
    },

    _get_permissions: function () {
        if (this._rectangle == null || this._vObjects.get_count() === 0)
            return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission({}, false);

        var permissions = this._vObjects.get_item(0).get_permissions().clone();
        if (this._vObjects.get_count() > 1 && (this._rectangle.Angle - this._vObjects.get_item(0).get_angle()) % 90 !== 0)
            permissions.set_allowArbitraryResize(false);

        for (var i = 1; i < this._vObjects.get_count() ; i++) {
            var vo = this._vObjects.get_item(i);
            var voPermissions = vo.get_permissions();
            if (!voPermissions.get_allowMoveHorizontal())
                permissions.set_allowMoveHorizontal(false);

            if (!voPermissions.get_allowMoveVertical())
                permissions.set_allowMoveVertical(false);

            if (!voPermissions.get_allowRotate())
                permissions.set_allowRotate(false);

            if (!voPermissions.get_allowProportionalResize())
                permissions.set_allowProportionalResize(false);

            if (!voPermissions.get_allowArbitraryResize() || (this._rectangle.Angle - vo.get_angle()) % 90 !== 0)
                permissions.set_allowArbitraryResize(false);
        }

        return permissions;
    },

    _get_allowNegativeResize: function () {
        if (this._rectangle == null || this._vObjects.get_count() === 0)
            return false;

        for (var i = 0; i < this._vObjects.get_count() ; i++) {
            if (!this._vObjects.get_item(i)._allowNegativeResize)
                return false;
        }

        return true;
    },

    _get_region: function () {
        var rectangle = null;

        if (this._canvas.get_constrainedMarginEnabled() && this._canvas.get_margin() > 0) {
            var margin = this._canvas.get_margin();
            rectangle = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(
                margin, margin, this._canvas.get_workspaceWidth() - margin, this._canvas.get_workspaceHeight() - margin);
        }

        var selectedLayers = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection();
        for (var i = 0; i < this._vObjects.get_count() ; i++) {
            var layer = this._vObjects.get_item(i).get_layer();
            if (layer != null && layer.get_region() != null && !selectedLayers.contains(layer))
                selectedLayers.add(layer);
        }

        for (var j = 0; j < selectedLayers.get_count() ; j++) {
            var region = selectedLayers.get_item(j).get_region();

            rectangle = rectangle != null ? Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF.intersect(rectangle, region) : region;
        }

        return rectangle;
    },

    _updateRectangle: function (rectangle) {
        if (this._region != null && !this._region.containsRectangle(rectangle.get_bounds()))
            return;

        this._rectangle = rectangle;
        for (var i = 0; i < this._vObjects.get_count() ; i++) {
            this._vObjects.get_item(i)._transformRectangle(this._startRectangle, this._rectangle);
        }
    },

    _constrainDiffToRegion: function (bounds, diff) {
        if (this._region != null) {
            if (bounds.Left + diff.X < this._region.Left)
                diff.X = this._region.Left - bounds.Left;

            if (bounds.Top + diff.Y < this._region.Top)
                diff.Y = this._region.Top - bounds.Top;

            if (bounds.Right + diff.X > this._region.Left + this._region.Width)
                diff.X = this._region.Left + this._region.Width - bounds.Right;

            if (bounds.Bottom + diff.Y > this._region.Top + this._region.Height)
                diff.Y = this._region.Top + this._region.Height - bounds.Bottom;
        }

        return diff;
    },

    _set_angle: function (angle) {
        this._startTransform();
        var r = this._rectangle.clone();
        r.Angle = angle;
        this._updateRectangle(r);
        this._endTransform();
        this._canvas.redraw();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SelectionHandler.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.SelectionHandler");