// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PathSegment = function (name, points) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PathSegment.initializeBase(this);

    this._name = (name) ? name.toUpperCase() : "";
    this._points = (points) ? points : [];
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PathSegment.prototype = {
    get_name: function () {
        return this._name;
    },

    get_point: function (index) {
        return this._points[index];
    },

    get_length: function () {
        return this._points.length;
    },

    _transform: function (transform, center) {
        for (var i = 0; i < this.get_length() ; i++) {
            this.get_point(i).transform(transform, center);
        }
    },

    _draw: function (ctx) {
        switch (this.get_name()) {
            case "Z":
                ctx.closePath();
                break;
            case "M":
                ctx.moveTo(this.get_point(0).X, this.get_point(0).Y);
                break;
            case "L":
                ctx.lineTo(this.get_point(0).X, this.get_point(0).Y);
                break;
            case "Q":
                ctx.quadraticCurveTo(this.get_point(0).X, this.get_point(0).Y, this.get_point(1).X, this.get_point(1).Y);
                break;
            case "C":
                ctx.bezierCurveTo(this.get_point(0).X, this.get_point(0).Y, this.get_point(1).X, this.get_point(1).Y, this.get_point(2).X, this.get_point(2).Y);
                break;
        }
    },

    _toString: function () {
        var s = this.get_name();
        for (var i = 0; i < this.get_length() ; i++) {
            s += " " + this.get_point(i).X + " " + this.get_point(i).Y;
        }

        return s;
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PathSegment.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PathSegment");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path = function (path) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path.initializeBase(this);

    this._segments = [];

    if (path)
        this._fromString(path);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path.prototype = {
    get_length: function () {
        return this._segments.length;
    },

    add_pathChanged: function (handler) {
        this.get_events().addHandler("pathChanged", handler);
    },

    remove_pathChanged: function (handler) {
        this.get_events().removeHandler("pathChanged", handler);
    },

    _onChanged: function () {
        var handler = this.get_events().getHandler("pathChanged");
        if (handler) {
            handler(this);
        }
    },

    moveTo: function (x, y) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        this._segments.push(new ns.PathSegment("M", [new ns.PointF(x, y)]));

        this._onChanged();
    },

    lineTo: function (x, y) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        this._segments.push(new ns.PathSegment("L", [new ns.PointF(x, y)]));

        this._onChanged();
    },

    quadraticTo: function (cx, cy, x, y) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        this._segments.push(new ns.PathSegment("Q", [new ns.PointF(cx, cy), new ns.PointF(x, y)]));

        this._onChanged();
    },

    cubicTo: function (cx1, cy1, cx2, cy2, x, y) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        this._segments.push(new ns.PathSegment("C", [new ns.PointF(cx1, cy1), new ns.PointF(cx2, cy2), new ns.PointF(x, y)]));

        this._onChanged();
    },

    close: function () {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        this._segments.push(new ns.PathSegment("Z"));

        this._onChanged();
    },

    transform: function (transform, center) {
        for (var i = 0; i < this.get_length() ; i++)
            this._segments[i]._transform(transform, center);
    },

    draw: function (ctx) {
        if (!ctx)
            return;

        ctx.beginPath();

        for (var i = 0; i < this.get_length() ; i++)
            this._segments[i]._draw(ctx);
    },

    toString: function () {
        var s = "";
        for (var i = 0; i < this.get_length() ; i++) {
            s += this._segments[i]._toString();
            if (i < this._segments.length - 1)
                s += " ";
        }

        return s;
    },

    clone: function () {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path(this.toString());
    },

    isEqual: function (path) {
        return (this.toString() === path.toString());
    },

    _fromString: function (s) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        var parts = s.split(' ');

        var startIndex = 0;
        while (startIndex < parts.length) {
            var name = parts[startIndex];

            var endIndex = startIndex + 1;
            var values = [];
            while (endIndex < parts.length) {
                var value = parseFloat(parts[endIndex]);
                if (!isNaN(value) && isFinite(value)) {
                    values.push(value);
                    endIndex++;
                }
                else
                    break;
            }

            var i = 0;
            var points = [];
            while (i < values.length) {
                points.push(new ns.PointF(values[i], values[i + 1]));
                i += 2;
            }

            var segment = new ns.PathSegment(name, points);
            this._segments.push(segment);

            startIndex = endIndex;
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path.rectangle = function (left, top, width, height) {
    var path = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path();
    path.moveTo(left, top);
    path.lineTo(left + width, top);
    path.lineTo(left + width, top + height);
    path.lineTo(left, top + height);
    path.lineTo(left, top);
    path.close();

    return path;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path.ellipse = function (left, top, width, height) {
    var eNumber = 0.5517;
    var hWidth = width / 2;
    var hHeight = height / 2;

    var path = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path();
    path.moveTo(left, top + hHeight);
    path.cubicTo(left, top + hHeight - hHeight * eNumber, left + hWidth - hWidth * eNumber, top, left + hWidth, top);
    path.cubicTo(left + hWidth + hWidth * eNumber, top, left + width, top + hHeight * eNumber, left + width, top + hHeight);
    path.cubicTo(left + width, top + hHeight + hHeight * eNumber, left + hWidth + hWidth * eNumber, top + height, left + hWidth, top + height);
    path.cubicTo(left + hWidth - hWidth * eNumber, top + height, left, top + hHeight + hHeight * eNumber, left, top + hHeight);
    path.close();

    return path;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path", Sys.Component);