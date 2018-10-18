// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math");

// Oriented Square.
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getOrientedSquare = function (p1, p2, p3) {
    return (p1.X * p2.Y + p1.Y * p3.X + p2.X * p3.Y) - (p3.X * p2.Y + p2.X * p1.Y + p3.Y * p1.X);
};

// Get bounding rectangle of array of points
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getBounds = function (points) {
    if (points.length == 0) {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(0, 0, 0, 0);
    }
    var p = points[0],
		minX = p.X,
		maxX = p.X,
		minY = p.Y,
		maxY = p.Y;
    for (var i = 1, imax = points.length; i < imax; ++i) {
        p = points[i];
        minX = Math.min(minX, p.X);
        maxX = Math.max(maxX, p.X);
        minY = Math.min(minY, p.Y);
        maxY = Math.max(maxY, p.Y);
    }
    return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(minX, minY, maxX - minX, maxY - minY);
};

// returns angle in radians near p3 point.
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getTriangleAngle = function (p1, p2, p3) {
    var c2 = Math.pow(p1.X - p2.X, 2) + Math.pow(p1.Y - p2.Y, 2);
    var b2 = Math.pow(p1.X - p3.X, 2) + Math.pow(p1.Y - p3.Y, 2);
    var a2 = Math.pow(p2.X - p3.X, 2) + Math.pow(p2.Y - p3.Y, 2);

    var cosAlpha = 0;
    if (a2 * b2 != 0) {
        cosAlpha = (-c2 + a2 + b2) / (2 * Math.sqrt(a2) * Math.sqrt(b2));
    }

    // oriented s.
    var orientedSquare = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getOrientedSquare(p1, p2, p3);
    var angle = Math.acos(cosAlpha);
    if (orientedSquare > 0) angle = -angle;
    return Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.ConvertRadianToDegree(angle);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.normalizeAngle = function (angle) {
    angle = angle % 360;
    if (angle < 0) {
        angle += 360;
    }
    return angle;
};

//return scalar product of 2 vectors
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getScalarProduct = function (v1, v2) {
    return (v1.X * v2.X + v1.Y * v2.Y);
};

//return square the distance from piont to segment,
//p - point, p1 - start of segment, p2 - end of segment
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getSquareDistanceToSegment = function (p, p1, p2) {
    with (Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math) {
        var v = new PointF(p2.X - p1.X, p2.Y - p1.Y);
        var w = new PointF(p.X - p1.X, p.Y - p1.Y);
        var c1 = getScalarProduct(w, v);
        if (c1 <= 0)
            return getSquareDistanceToPoint(p, p1);
        var c2 = getScalarProduct(v, v);
        if (c2 < c1)
            return getSquareDistanceToPoint(p, p2);
        var b = c1 / c2;
        var ph = new PointF(p1.X + v.X * b, p1.Y + v.Y * b);
        return getSquareDistanceToPoint(p, ph);
    }
};

//return square the distance between 2 points
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getSquareDistanceToPoint = function (p1, p2) {
    return (p2.X - p1.X) * (p2.X - p1.X) + (p2.Y - p1.Y) * (p2.Y - p1.Y);
};

// returns width of the line depending on scale factors.
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getLineWidth = function (p1, p2, width, scaleX, scaleY) {
    function solve(x, y, x1, y1) {
        var a = Math.pow(y - y1, 2);
        var b = Math.pow(x - x1, 2);
        return Math.sqrt(a * b / (b + a));
    }

    if (p1.X == p2.X)
        return width * scaleX;
    if (p1.Y == p2.Y)
        return width * scaleY;

    var a = solve(p1.X, p1.Y, p2.X, p2.Y);
    var b = solve(p1.X * scaleX, p1.Y * scaleY, p2.X * scaleX, p2.Y * scaleY);
    return width * b / a;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.ConvertDegreeToRadian = function (angle) {
    return Math.PI * angle / 180;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.ConvertRadianToDegree = function (angle) {
    return 180 * angle / Math.PI;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Clamp = function (min, val, max) {
    return Math.max(min, Math.min(max, val));
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers = function (f1, f2, tolerance) {
    if (typeof f1 != "number" || typeof f2 != "number")
        return false;

    if (typeof tolerance != "number")
        tolerance = 0.0001;

    return tolerance != 0 ? Math.abs(f1 - f2) <= tolerance : f1 == f2;
};