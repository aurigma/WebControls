//-----------------------------------------------------------------------
// Aurigma Graphics Mill for .NET 
// Copyright 2004-2013 Aurigma Inc.
//-----------------------------------------------------------------------

Type.registerNamespace("Aurigma.GraphicsMill");

Aurigma.GraphicsMill.Utils = function () {
	/// <exclude />
	throw Error.notImplemented();
};

Aurigma.GraphicsMill.Utils.round3 = function (value) {
	/// <param name="value" type="Number" mayBeNull="false" />
	/// <returns type="Number" />
	return Math.round(value * 1000) / 1000;
};

Aurigma.GraphicsMill.Utils.createBoundedWrapper = function (object, method, aArgsArray) {
	return function () {
		var args = (aArgsArray === undefined) ? arguments : aArgsArray;
		return method.apply(object, args);
	};
};

Aurigma.GraphicsMill.Utils.cursorToCss = function(cursor) 
{
	/// <param name="value" type="Aurigma.GraphicsMill.Cursor" mayBeNull="false" />
	/// <returns type="String" />
	var c = Aurigma.GraphicsMill.Utils._cursorCss;
	if (c == undefined) {
		//Array item index corresponds to Aurigma.GraphicsMill.Cursor enum values
		c = ["default", "nw-resize", "ne-resize", "sw-resize", "se-resize",
			"n-resize", "s-resize", "w-resize", "e-resize", "move", "crosshair",
			"url('" + Aurigma.GraphicsMill.Resources.getUrl("ZoomIn.cur") + "'),-moz-zoom-in",
			"url('" + Aurigma.GraphicsMill.Resources.getUrl("ZoomOut.cur") + "'),-moz-zoom-out",
			"url('" + Aurigma.GraphicsMill.Resources.getUrl("Pan.cur") + "'),move",
		    "pointer"];
		Aurigma.GraphicsMill.Utils._cursorCss = c;
	}
	return c[cursor];
};

/**
 * @param {UIEvent} uiEvent 
 * @return {Element[]}
 */
Aurigma.GraphicsMill.Utils.getEventPath = function (uiEvent) {
    if (!(uiEvent instanceof UIEvent))
        throw new Error("Unexpected event type");

    if (uiEvent.path != null) {
        var nativePath = Array.isArray(uiEvent.path) ? uiEvent.path : Array.prototype.slice.call(uiEvent.path);

        return nativePath.filter(function(el) { return el instanceof Element; });
    }

    var rv = [];
    var element = uiEvent.target;
    if (!(element instanceof Element) && console != null)
        console.log("unexpected event target", element);

    do {
        rv.push(element);
        element = element.parentElement;
    }
    while (element != null && element !== uiEvent.currentTarget);

    return rv;
}

/**
 * @param {UIEvent | Sys.UI.DomEvent | JqueryEventObject } event 
 */
Aurigma.GraphicsMill.Utils.isEventPathContainsClass = function (event, cssClass) {
    var uiEvent;
    if (event instanceof UIEvent) {
        uiEvent = event;
    } else if (event instanceof Sys.UI.DomEvent) {
        uiEvent = event.rawEvent;
    } else if (event.originalEvent instanceof UIEvent) {
        uiEvent = event.originalEvent;
    } else {
        throw new Error("Unexpected event type");
    }

    var path = Aurigma.GraphicsMill.Utils.getEventPath(uiEvent);

    if (path.some(function (element) { return Sys.UI.DomElement.containsCssClass(element, cssClass); }))
        return true;
    
    return false;
}

Aurigma.GraphicsMill.Utils.Platform =
{
    IsIos: function () {
        return !!navigator.userAgent.match(/(iPod|iPhone|iPad)/);
    },

    IosMajorVersion: function () {
        var ua = navigator.userAgent;

        var uaIndex = ua.indexOf('OS ');

        if (uaIndex > -1)
            return Number(ua.substr(uaIndex + 3, 3).replace('_', '.').charAt(0));
    },

    IsAndroid: function () {
        return !!navigator.userAgent.toLowerCase().match(/(android)/);
    },

    IsTouchDevice: function () {
        return Aurigma.GraphicsMill.Utils.Platform.IsIos() || Aurigma.GraphicsMill.Utils.Platform.IsAndroid() || Aurigma.GraphicsMill.Utils.Platform.IsTouchIE();
    },

    IsNativeAndroidBrowser: function () {
        var nua = navigator.userAgent;
        return ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));
    },

    IsGoogleChrome: function () {
        return typeof window.chrome == "object";
    },

    IsSafari: function () {
        return navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    },

    IsTouchIE: function () {
        return navigator.userAgent.indexOf('Trident') != -1 && navigator.userAgent.indexOf('Touch') != -1;
    },

    IsIE: function () {
        if (Sys.Browser.agent === Sys.Browser.InternetExplorer)
            return true;

        if (Sys.Browser.agent == null)
            return navigator.userAgent.indexOf('Trident') != -1;

        return false;
    },

    IsEdge: function () {
        return navigator.userAgent.indexOf('Edge') != -1;
    }
};

Aurigma.GraphicsMill.Utils.registerClass("Aurigma.GraphicsMill.Utils");

Aurigma.GraphicsMill.Rectangle = function(x, y, width, height) {
    /// <summary>This client-side stores a set of four numbers that represent the location and size of a rectangle.</summary>
	/// <param name="x" type="Number" mayBeNull="false">The x-coordinate of the upper-left corner.</param>
	/// <param name="y" type="Number" mayBeNull="false">The y-coordinate of the upper-left corner.</param>
	/// <param name="width" type="Number" mayBeNull="false">The rectangle width.</param>
	/// <param name="height" type="Number" mayBeNull="false">The rectangle height.</param>
	/// <field name="x" type="Number"><summary>The x-coordinate of the upper-left corner.</summary></field>
	/// <field name="y" type="Number"><summary>The y-coordinate of the upper-left corner.</summary></field>
	/// <field name="width" type="Number"><summary>The rectangle width.</summary></field>
	/// <field name="height" type="Number"><summary>The rectangle height.</summary></field>
	/// <seealso cref="T:System.Drawing.Rectangle" />
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}
Aurigma.GraphicsMill.Rectangle.prototype = {
	clone : function() {
		/// <summary>Clones rectangle.</summary>
		/// <returns type="Aurigma.GraphicsMill.Rectangle">The cloned <see cref="T:J:Aurigma.GraphicsMill.Rectangle" />.</returns>
		return new Aurigma.GraphicsMill.Rectangle(this.x, this.y, this.width, this.height);
	},
	
	round : function() {
		/// <summary>Rounds all parameters: <see cref="F:J:Aurigma.GraphicsMill.Rectangle.x" />, <see cref="F:J:Aurigma.GraphicsMill.Rectangle.y" />, <see cref="F:J:Aurigma.GraphicsMill.Rectangle.width" />, and <see cref="F:J:Aurigma.GraphicsMill.Rectangle.height" />; and returns new <see cref="T:J:Aurigma.GraphicsMill.Rectangle" /> object.</summary>
		/// <returns type="Aurigma.GraphicsMill.Rectangle">New rounded <see cref="T:J:Aurigma.GraphicsMill.Rectangle" /> object.</returns>
		return new Aurigma.GraphicsMill.Rectangle(Math.round(this.x), Math.round(this.y), Math.round(this.width), Math.round(this.height));
	},
	
	equals : function(rect) {
		/// <summary>Determines whether the specified rectangle equals to this <see cref="T:J:Aurigma.GraphicsMill.Rectangle" />.</summary>
		/// <param name="rect" type="Aurigma.GraphicsMill.Rectangle">The <see cref="T:J:Aurigma.GraphicsMill.Rectangle" /> to test.</param>	
		/// <returns type="Boolean">This method returns <b>true</b> if <paramref name="rect" /> is a <see cref="T:J:Aurigma.GraphicsMill.Rectangle" /> structure and its <see cref="F:J:Aurigma.GraphicsMill.Rectangle.x" />, <see cref="F:J:Aurigma.GraphicsMill.Rectangle.y" />, <see cref="F:J:Aurigma.GraphicsMill.Rectangle.width" />, and <see cref="F:J:Aurigma.GraphicsMill.Rectangle.height" /> fields are equal to the corresponding fields of this <see cref="T:J:Aurigma.GraphicsMill.Rectangle" /> structure; otherwise, <b>false</b>.</returns>
		return this.x == rect.x && this.y == rect.y && this.width == rect.width && this.height == rect.height;
	},
	
	contains : function(pt) {
		/// <summary>Determines if the specified point is contained within the rectangular region defined by this <see cref="T:J:Aurigma.GraphicsMill.Rectangle" />.</summary>
		/// <param name="pt" type="Aurigma.GraphicsMill.PointF">The <see cref="T:J:Aurigma.GraphicsMill.PointF" /> to test.</param>
		/// <returns type="Boolean">This method returns <b>true</b> if the point represented by <paramref name="pt" /> is contained within this <see cref="T:J:Aurigma.GraphicsMill.Rectangle" /> structure; otherwise <b>false</b>.</returns>
		return ((this.x <= pt.x) && (this.y <= pt.y) && (this.x + this.width > pt.x) && (this.y + this.height > pt.y));
	},
	
	intersectsWith : function(rect) {
		/// <summary>Determines if this <see cref="T:J:Aurigma.GraphicsMill.Rectangle" /> intersects with <paramref name="rect" />.</summary>
		/// <param name="rect" type="Aurigma.GraphicsMill.Rectangle">The <see cref="T:J:Aurigma.GraphicsMill.Rectangle" /> to test.</param>
		/// <returns type="Boolean">This method returns <b>true</b> if there is any intersection, otherwise <b>false</b>.</returns>
		return this.contains(new Aurigma.GraphicsMill.PointF(rect.x, rect.y)) ||
			this.contains(new Aurigma.GraphicsMill.PointF(rect.x + rect.width - 1, rect.y + rect.height - 1)) ||
			rect.contains(new Aurigma.GraphicsMill.PointF(this.x, this.y)) ||
			rect.contains(new Aurigma.GraphicsMill.PointF(this.x + this.width - 1, this.y + this.height - 1));
	},
	
	intersect : function(rect) {
		/// <summary>Calculates intersection of two rectangles.</summary>
		/// <param name="rect" type="Aurigma.GraphicsMill.Rectangle">The <see cref="T:J:Aurigma.GraphicsMill.Rectangle" /> to calculate intersection.</param>	
		/// <returns type="Aurigma.GraphicsMill.Rect">New <see cref="T:J:Aurigma.GraphicsMill.Rectangle" /> represented the intersection of original rectangles.</returns>
		if (!this.intersectsWith(rect)) {
			return new Aurigma.GraphicsMill.Rectangle(0, 0, -1, -1);
		}
		var x = Math.max(this.x, rect.x);
		var y = Math.max(this.y, rect.y);
		var x1 = Math.min(this.x + this.width - 1, rect.x + rect.width - 1);
		var y1 = Math.min(this.y + this.height - 1, rect.y + rect.height - 1);
		return new Aurigma.GraphicsMill.Rectangle(x, y, x1 - x + 1, y1 - y + 1);
	}
};
Aurigma.GraphicsMill.Rectangle.registerClass("Aurigma.GraphicsMill.Rectangle");


Aurigma.GraphicsMill.PointF = function(x, y) {
    /// <summary>This client-side class corresponds to the <see cref="T:System.Drawing.PointF" /> class and represents an ordered pair of floating-point x- and y-coordinates that defines a point in a two-dimensional plane.</summary>
	/// <param name="x" type="Number" integer="false">The x-coordinate.</param>
	/// <param name="y" type="Number" integer="false">The y-coordinate.</param>
	/// <field name="x" type="Number" integer="false"><summary>The x-coordinate.</summary></field>
	/// <field name="y" type="Number" integer="false"><summary>The y-coordinate.</summary></field>
	/// <seealso cref="T:System.Drawing.PointF" />
	this.x = x;
	this.y = y;
}

Aurigma.GraphicsMill.PointF.prototype = {
	round : function () {
		/// <summary>Returns point with rounded coordinates.</summary>
		/// <returns type="Aurigma.GraphicsMill.PointF">The rounded <see cref="T:J:Aurigma.GraphicsMill.PointF" /> object.</returns>
		return new Aurigma.GraphicsMill.PointF(Math.round(this.x), Math.round(this.y));
	},
	
	toPoint : function () {
		/// <summary>Converts to <see cref="T:J:Sys.UI.Point"/>.</summary>
		/// <returns type="Sys.UI.Point">The new <see cref="T:J:Sys.UI.Point" /> object which contains rounded <see cref="F:J:Aurigma.GraphicsMill.PointF.x" /> and <see cref="F:J:Aurigma.GraphicsMill.PointF.y" /> coordinates of this <see cref="T:J:Aurigma.GraphicsMill.PointF" />.</returns>
		return new Sys.UI.Point(Math.round(this.x), Math.round(this.y));
	}
}

Aurigma.GraphicsMill.PointF.registerClass('Aurigma.GraphicsMill.PointF');

Aurigma.GraphicsMill.Cursor = function() {
	/// <exclude />
	/// <field name="defaultCursor" type="Number" integer="true" static="true" />
	/// <field name="sizeNW" type="Number" integer="true" static="true" />
	/// <field name="sizeNE" type="Number" integer="true" static="true" />
	/// <field name="sizeSW" type="Number" integer="true" static="true" />
	/// <field name="sizeSE" type="Number" integer="true" static="true" />
	/// <field name="sizeN" type="Number" integer="true" static="true" />
	/// <field name="sizeS" type="Number" integer="true" static="true" />
	/// <field name="sizeW" type="Number" integer="true" static="true" />
	/// <field name="sizeE" type="Number" integer="true" static="true" />
	/// <field name="move" type="Number" integer="true" static="true" />
	/// <field name="cross" type="Number" integer="true" static="true" />
	/// <field name="zoomIn" type="Number" integer="true" static="true" />
	/// <field name="zoomOut" type="Number" integer="true" static="true" />
    /// <field name="pan" type="Number" integer="true" static="true" />
    /// <field name="pointer" type="Number" integer="true" static="true" />
	throw Error.notImplemented();
};
Aurigma.GraphicsMill.Cursor.prototype = {
	defaultCursor : 0,
	sizeNW : 1,
	sizeNE : 2,
	sizeSW : 3,
	sizeSE : 4,
	sizeN : 5,
	sizeS : 6,
	sizeW : 7,
	sizeE : 8,
	move : 9,
	cross : 10,
	zoomIn : 11,
	zoomOut: 12,
	pan: 13,
    pointer: 14
};
Aurigma.GraphicsMill.Cursor.registerEnum("Aurigma.GraphicsMill.Cursor", false);

Aurigma.GraphicsMill.ColorSpace = function() {
    /// <summary>Specifies color spaces supported with Graphics Mill.</summary>
	/// <field name="rgb" type="Number" integer="true" static="true"><summary>RGB.</summary></field>
	/// <field name="cmyk" type="Number" integer="true" static="true"><summary>CMYK.</summary></field>
	/// <field name="grayScale" type="Number" integer="true" static="true"><summary>Grayscale.</summary></field>
	/// <field name="unknown" type="Number" integer="true" static="true"><summary>Undefined color space (returned when bitmap is not initialized).</summary></field>
	throw Error.notImplemented();
};
Aurigma.GraphicsMill.ColorSpace.prototype = {
	rgb : 16777216,
	cmyk : 335544320,
	grayScale : 301989888,
	unknown : 0
};
Aurigma.GraphicsMill.ColorSpace.registerEnum("Aurigma.GraphicsMill.ColorSpace");

if (typeof(Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();