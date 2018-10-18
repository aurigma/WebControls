// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
(function () {
    Type.registerNamespace('Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math');

    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;

    /*
	*	Creates a 2D transform matrix.
	*	[ x']   [  m00  m01  m02  ] [ x ]   [ m00x + m01y + m02 ]
	*	[ y'] = [  m10  m11  m12  ] [ y ] = [ m10x + m11y + m12 ]
	*	[ 1 ]   [   0    0    1   ] [ 1 ]   [         1         ]
	*/
    ns.Matrix = function (a, b, c, d, e, f) {
        if (arguments.length == 6) {
            this.set_transform(a, b, c, d, e, f);
        } else if (arguments.length == 0) {
            this.set_transform(1, 0, 0, 1, 0, 0);
        } else {
            throw new Error('Arguments error');
        }
    };

    ns.Matrix.prototype = {
        set_transform: function (a, b, c, d, e, f) {
            this.m00 = a;
            this.m10 = b;
            this.m01 = c;
            this.m11 = d;
            this.m02 = e;
            this.m12 = f;
        },

        transformPoint: function (p, clone) {
            var pp = clone ? new ns.PointF() : p;
            var x = p.X,
				y = p.Y;
            pp.X = x * this.m00 + y * this.m01 + this.m02;
            pp.Y = x * this.m10 + y * this.m11 + this.m12;
            return pp;
        },

        transformPoints: function (pts, clone) {
            var result = clone ? [] : pts;
            for (var i = 0, imax = pts.length; i < imax; ++i) {
                var p = pts[i],
					pp = clone ? new ns.PointF() : p,
					x = p.X,
					y = p.Y;
                pp.X = x * this.m00 + y * this.m01 + this.m02;
                pp.Y = x * this.m10 + y * this.m11 + this.m12;
                result[i] = pp;
            }
            return result;
        },

        concatenate: function (m) {
            var m0 = this.m00;
            var m1 = this.m01;
            this.m00 = m.m00 * m0 + m.m10 * m1;
            this.m01 = m.m01 * m0 + m.m11 * m1;
            this.m02 += m.m02 * m0 + m.m12 * m1;

            m0 = this.m10;
            m1 = this.m11;
            this.m10 = m.m00 * m0 + m.m10 * m1;
            this.m11 = m.m01 * m0 + m.m11 * m1;
            this.m12 += m.m02 * m0 + m.m12 * m1;
            return this;
        },

        rotate: function (angle) {
            return this.rotateAt(angle, 0, 0);
        },

        rotateAt: function (angle, x, y) {
            angle = ns.ConvertDegreeToRadian(angle);
            var cos = Math.cos(angle),
				sin = Math.sin(angle),
				m = new ns.Matrix(cos, sin, -sin, cos, x - x * cos + y * sin, y - x * sin - y * cos);
            return this.concatenate(m);
        },

        scale: function (sx, sy) {
            this.m00 *= sx;
            this.m10 *= sx;
            this.m01 *= sy;
            this.m11 *= sy;
            return this;
        },

        translate: function (dx, dy) {
            this.m02 += dx * this.m00 + dy * this.m01;
            this.m12 += dx * this.m10 + dy * this.m11;
            return this;
        },

        preTranslate: function (dx, dy) {
            this.m02 += dx;
            this.m12 += dy;
            return this;
        },

        toString: function () {
            return 'matrix(' + [this.m00, this.m10, this.m01, this.m11, this.m02, this.m12].join(', ') + ')';
        }
    };

    ns.Matrix.registerClass('Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Matrix');
})();