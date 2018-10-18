// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

//#region Color
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color = function (value) {
    if (typeof value.Preview == "string" && value.Preview.length > 0)
        this.Preview = value.Preview;
    else
        this.Preview = null;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor = function (value) {
    if (Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.isInstanceOfType(value)) {
        return value;
    }
    if (typeof value == "object" && value != null) {
        return Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(value);
    }
    else if (typeof value == "string" && value.length > 0) {
        if (value.indexOf("device-cmyk") === 0)
            return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor(value);
        else
            return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor(value);
    }

    console.warn("Unable to create color from value " + value);
    return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor("rgba(0,0,0,1)");
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data = function (data) {
    if (data.__type === "RgbColor") {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor(data);
    }
    else if (data.__type === "CmykColor") {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor(data);
    }
    else if (data.__type === "GrayscaleColor") {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor(data);
    }
    else
        throw "Unsupported color type " + data.__type;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.prototype = {
    Preview: null,

    clone: function () { },

    equals: function (color) {
        return Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.isInstanceOfType(color) &&
            this.Preview === color.Preview;
    },

    toString: function () {
    },

    _get_preview: function () { },

    _get_data: function () {
        var type = Object.getType(this).getName().split('.');
        type = type[type.length - 1];

        var data = this.clone();
        data.__type = type;

        return data;
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color");
//#endregion

//#region RgbColor
Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor = function (value) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor.initializeBase(this, [value]);

    if (typeof value == "string") {
        //try to parse named color to rgb(...)
        if (value.indexOf("#") !== 0 && value.indexOf("rgb") !== 0) {
            if (window.getComputedStyle) {
                var div = document.createElement("div");
                div.style.color = value;
                document.body.appendChild(div);
                value = window.getComputedStyle(div).color;
                document.body.removeChild(div);
            } else {
                console.warn("Unable to parse rgb color string " + value);
                return;
            }
        }

        var rgba = /^\s*rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\,\s*(\d{1,}(\.\d{1,})?)\s*\)\s*;{0,1}\s*$/g;
        var match = rgba.exec(value);
        if (match != null && match.length === 6) {
            var a = (+match[4] * 255).toFixed(0);
            a = Math.max(a, 0);
            a = Math.min(a, 255);

            this._init(+match[1], +match[2], +match[3], a);
            return;
        }

        var rgb = /^\s*rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*;{0,1}\s*$/g;
        match = rgb.exec(value);
        if (match != null && match.length === 4) {
            this._init(+match[1], +match[2], +match[3], 255);
            return;
        }

        var shortHex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        value = value.replace(shortHex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var standardHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
        match = standardHex.exec(value);
        if (match != null && match.length === 4) {
            this._init(parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16), 255);
        }
    }
    else if (typeof value.R == "number" && typeof value.G == "number" && typeof value.B == "number") {
        this._init(value.R, value.G, value.B, (typeof value.A == "number") ? value.A : 255);
    }
    else
        console.warn("Incorrect RgbColor format: " + value);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor.prototype = {
    R: 0,
    G: 0,
    B: 0,
    A: 255,

    clone: function () {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor(this);
    },

    equals: function (color) {
        var baseEquals = Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor.callBaseMethod(this, 'equals', [color]);
        return baseEquals && color instanceof Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor &&
            this.R === color.R && this.G === color.G && this.B === color.B && this.A === color.A;
    },

    toString: function () {
        return this._get_preview();
    },

    _get_preview: function () {
        if (this.A === 255) {
            return "rgb(" + this.R + "," + this.G + "," + this.B + ")";
        }
        else {
            var a = (this.A / 255).toFixed(7);
            return "rgba(" + this.R + "," + this.G + "," + this.B + "," + a + ")";
        }
    },

    _init: function (r, g, b, a) {
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;

        if (this.Preview == null)
            this.Preview = this._get_preview();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor", Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color);
//#endregion

//#region CmykColor
Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor = function (value) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor.initializeBase(this, [value]);

    if (typeof value == "string") {
        var cmyk = /^\s*device-cmyk\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\,\s*(\d{1,3})\s*(\,\s*(\d{1,}(\.\d{1,})?))?\s*(\,\s*(.*)\s*)?\)\s*;{0,1}\s*$/g;
        var match = cmyk.exec(value);
        if (match != null && match.length === 10) {
            var c = +match[1];
            var m = +match[2];
            var y = +match[3];
            var k = +match[4];

            var a = 255;
            if (match[6] != undefined) {
                a = (+match[6] * 255).toFixed(0);
                a = Math.max(a, 0);
                a = Math.min(a, 255);
            }

            var preview = undefined;
            if (match[9] != undefined) {
                preview = match[9];
            }

            this._init(c, m, y, k, a, preview);
        }
    }
    else if (typeof value.C == "number" && typeof value.M == "number" && typeof value.Y == "number" && typeof value.K == "number") {
        this._init(value.C, value.M, value.Y, value.K, (typeof value.A == "number") ? value.A : 255);
    }
    else
        console.warn("Incorrect CmykColor format: " + value);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor.prototype = {
    C: 255,
    M: 255,
    Y: 255,
    K: 255,
    A: 255,

    clone: function () {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor(this);
    },

    equals: function (color) {
        var baseEquals = Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor.callBaseMethod(this, 'equals', [color]);
        return baseEquals && color instanceof Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor &&
            this.C === color.C && this.M === color.M && this.Y === color.Y && this.K === color.K && this.A === color.A;
    },

    toString: function () {
        var a = (this.A / 255).toFixed(7);
        return "device-cmyk(" + this.C + ", " + this.M + ", " + this.Y + ", " + this.K + ", " + a + ", " + this.Preview + ")";
    },

    _get_preview: function () {
        var r = 255 - Math.min(255, this.C * (255 - this.K) + this.K);
        var g = 255 - Math.min(255, this.M * (255 - this.K) + this.K);
        var b = 255 - Math.min(255, this.Y * (255 - this.K) + this.K);

        return (new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor({ R: r, G: g, B: b, A: this.A })).Preview;
    },

    _init: function (c, m, y, k, a, preview) {
        this.C = c;
        this.M = m;
        this.Y = y;
        this.K = k;
        this.A = a;

        if (this.Preview == null)
            this.Preview = preview != undefined ? preview : this._get_preview();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor", Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color);
//#endregion

//#region Grayscale
Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor = function (value) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor.initializeBase(this, [value]);

    if (typeof value.L == "number") {
        this._init(value.L, (typeof value.A == "number") ? value.A : 255);
    }
    else
        console.warn("Incorrect GrayscaleColor format: " + value);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor.prototype = {
    L: 0,
    A: 255,

    clone: function () {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor(this);
    },

    equals: function (color) {
        var baseEquals = Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor.callBaseMethod(this, 'equals', [color]);
        return baseEquals && color instanceof Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor &&
            this.L === color.L && this.A === color.A;
    },

    toString: function () {
        return this._get_preview();
    },

    _get_preview: function () {
        if (this.A === 255) {
            return "rgb(" + this.L + "," + this.L + "," + this.L + ")";
        }
        else {
            var a = (this.A / 255).toFixed(7);
            return "rgba(" + this.L + "," + this.L + "," + this.L + "," + a + ")";
        }
    },

    _init: function (l, a) {
        this.L = l;
        this.A = a;

        if (this.Preview == null)
            this.Preview = this._get_preview();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor", Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color);

//#endregion