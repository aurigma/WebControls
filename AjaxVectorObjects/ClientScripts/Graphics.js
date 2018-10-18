// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawLine = function (ctx, x, y, x1, y1, lineWidth, lineColor, opacity) {
    if (!Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.isFullTransparentColor(lineColor) && lineWidth > 0 && (opacity == null || opacity > 0)) {
        ctx.save();
        if (opacity)
            ctx.globalAlpha = opacity;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x1, y1);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawDashedLine = function (ctx, x0, y0, x1, y1, lineWidth,
	color, altColor, dashWidth, altDashWidth, opacity) {
    if (lineWidth > 0 && dashWidth > 0 && altDashWidth > 0 && (opacity == null || opacity > 0)) {
        ctx.save();
        if (opacity)
            ctx.globalAlpha = opacity;
        ctx.lineWidth = lineWidth;

        if (x1 < x0) {
            var t = x0;
            x0 = x1;
            x1 = t;
            t = y0;
            y0 = y1;
            y1 = t;
        }

        var dx = x1 - x0;
        var dy = y1 - y0;

        var d = dashWidth + altDashWidth;
        var len = Math.sqrt(dx * dx + dy * dy);
        var dashCount = Math.floor(len / d);

        dx /= (len / d);
        dy /= (len / d);

        var dashX = dx * (dashWidth / d);
        var altDashX = dx * (altDashWidth / d);
        var dashY = dy * (dashWidth / d);
        var altDashY = dy * (altDashWidth / d);
        var x = x0;
        var y = y0;
        var i;
        if (!Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.isFullTransparentColor(color)) {
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(x, y);
            for (i = 0; i < dashCount; i++) {
                x += dashX;
                y += dashY;
                ctx.lineTo(x, y);

                x += altDashX;
                y += altDashY;
                if (i + 1 < dashCount) {
                    ctx.moveTo(x, y);
                }
            }
            if (x + dashX <= x1 && y + dashY <= y1) {
                ctx.moveTo(x, y);
                ctx.lineTo(x + dashX, y + dashY);
            } else {
                ctx.moveTo(x, y);
                ctx.lineTo(x1, y1);
            }
            ctx.closePath();
            ctx.stroke();
        }
        x = x0 + dashX;
        y = y0 + dashY;
        if (!Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.isFullTransparentColor(altColor)) {
            ctx.strokeStyle = altColor;
            ctx.beginPath();
            ctx.moveTo(x, y);
            for (i = 0; i < dashCount; i++) {
                x += altDashX;
                y += altDashY;
                ctx.lineTo(x, y);

                x += dashX;
                y += dashY;
                if (i + 1 < dashCount) {
                    ctx.moveTo(x, y);
                }
            }
            if (x < x1 && y < y1) {
                ctx.moveTo(x, y);
                ctx.lineTo(x1, y1);
            }
            ctx.closePath();
            ctx.stroke();
        }

        ctx.restore();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawPolyline = function (ctx, points, lineWidth, lineColor, opacity) {
    if (!Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.isFullTransparentColor(lineColor) && lineWidth > 0 && (opacity == null || opacity > 0)) {
        if (points && points.length > 1) {
            ctx.save();
            if (opacity)
                ctx.globalAlpha = opacity;
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = lineColor;
            ctx.beginPath();
            ctx.moveTo(points[0].X, points[0].Y);
            for (var i = 1, imax = points.length; i < imax; ++i) {
                var p = points[i];
                ctx.lineTo(p.X, p.Y);
            }
            ctx.stroke();
            ctx.restore();
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawPath = function (ctx, path, center, transform, borderWidth, borderColor, opacity) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.path(ctx, path, center, transform, null, borderWidth, borderColor, opacity);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.fillPath = function (ctx, path, center, transform, fillColor, opacity) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.path(ctx, path, center, transform, fillColor, 0, null, opacity);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.path = function (ctx, path, center, transform, fillColor, borderWidth, borderColor, opacity) {
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
    var stroke = borderColor != null && !ns.Graphics.isFullTransparentColor(borderColor) && borderWidth > 0;
    var fill = fillColor != null && !ns.Graphics.isFullTransparentColor(fillColor);

    if ((stroke || fill) && (opacity == null || opacity > 0)) {
        ctx.save();
        if (opacity)
            ctx.globalAlpha = opacity;

        var matrix = transform.toMatrix();

        ctx.translate(center.X, center.Y);
        ctx.transform(matrix.m00, matrix.m10, matrix.m01, matrix.m11, matrix.m02, matrix.m12);
        ctx.translate(-center.X, -center.Y);

        path.draw(ctx);

        if (fill) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }

        if (stroke) {
            if (!Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers(transform.get_scaleX(), transform.get_scaleY())) {
                ctx.restore();
                ctx.save();
                if (opacity)
                    ctx.globalAlpha = opacity;

                var transformedPath = path.clone();
                transformedPath.transform(transform, center);

                transformedPath.draw(ctx);
            } else
                borderWidth /= transform.get_scaleX();

            ctx.lineWidth = borderWidth;
            ctx.strokeStyle = borderColor;
            ctx.stroke();
        }

        ctx.restore();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.clipPath = function (ctx, path) {
    path.draw(ctx);
    ctx.clip();
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawImage = function (ctx, image, rotatedRectangle, scaleX, scaleY, disableSmoothing, maskColor, opacity) {
    if (opacity == null || opacity > 0) {
        ctx.save();
        if (opacity)
            ctx.globalAlpha = opacity;
        ctx.translate(rotatedRectangle.CenterX, rotatedRectangle.CenterY);
        ctx.rotate(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.ConvertDegreeToRadian(rotatedRectangle.Angle));

        var drawImageAsIs =
            scaleX != undefined && scaleX !== 0 &&
                scaleY != undefined && scaleY !== 0 &&
                Math.abs(image.naturalWidth - rotatedRectangle.Width * scaleX) < 1 &&
                Math.abs(image.naturalHeight - rotatedRectangle.Height * scaleY) < 1;

        if (!disableSmoothing) {
            // depend of angle if parameter not specified
            disableSmoothing = (ctx.mozImageSmoothingEnabled === true || ctx.imageSmoothingEnabled === true || ctx.msImageSmoothingEnabled === true) &&
                Math.abs(rotatedRectangle.Angle) % 90 < 0.01 && drawImageAsIs;
        }

        if (disableSmoothing) {
            ctx.mozImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
        }
        try {
            if (drawImageAsIs) {
                ctx.scale(1 / scaleX, 1 / scaleY);
                ctx.drawImage(image, -rotatedRectangle.Width * scaleX / 2, -rotatedRectangle.Height * scaleY / 2, image.naturalWidth, image.naturalHeight);
                ctx.scale(scaleX, scaleY);
            } else
                ctx.drawImage(image, -rotatedRectangle.Width / 2, -rotatedRectangle.Height / 2, rotatedRectangle.Width, rotatedRectangle.Height);

            if (maskColor && !Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.isFullTransparentColor(maskColor)) {
                ctx.fillStyle = maskColor;
                ctx.fillRect(-rotatedRectangle.Width / 2, -rotatedRectangle.Height / 2, rotatedRectangle.Width, rotatedRectangle.Height);
            }
        } catch (err) {
        }
        if (disableSmoothing) {
            ctx.mozImageSmoothingEnabled = true;
            ctx.imageSmoothingEnabled = true;
            ctx.msImageSmoothingEnabled = true;
        }

        ctx.restore();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawRectangle = function (ctx, rotatedRectangle, borderWidth, borderColor, opacity) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.rectangle(ctx, rotatedRectangle, borderWidth, borderColor, null, opacity);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.fillRectangle = function (ctx, rotatedRectangle, fillColor, opacity) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.rectangle(ctx, rotatedRectangle, 0, null, fillColor, opacity);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.rectangle = function (ctx, rotatedRectangle, borderWidth, borderColor, fillColor, opacity) {
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
    var stroke = borderColor && !ns.Graphics.isFullTransparentColor(borderColor) && borderWidth > 0;
    var fill = fillColor && !ns.Graphics.isFullTransparentColor(fillColor);

    if ((stroke || fill) && (opacity == null || opacity > 0)) {
        ctx.save();
        if (opacity)
            ctx.globalAlpha = opacity;

        ctx.translate(rotatedRectangle.CenterX, rotatedRectangle.CenterY);
        ctx.rotate(ns.Math.ConvertDegreeToRadian(rotatedRectangle.Angle));

        if (fill) {
            ctx.fillStyle = fillColor;
            ctx.fillRect(-rotatedRectangle.Width / 2, -rotatedRectangle.Height / 2, rotatedRectangle.Width, rotatedRectangle.Height);
        }

        if (stroke) {
            ctx.lineWidth = borderWidth;
            ctx.strokeStyle = borderColor;
            ctx.strokeRect(-rotatedRectangle.Width / 2, -rotatedRectangle.Height / 2, rotatedRectangle.Width, rotatedRectangle.Height);
        }

        ctx.restore();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.circle = function (ctx, x, y, r, borderWidth, borderColor, fillColor) {
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
    var stroke = borderColor != null && !ns.Graphics.isFullTransparentColor(borderColor) && borderWidth > 0;
    var fill = fillColor != null && !ns.Graphics.isFullTransparentColor(fillColor);

    if (stroke || fill) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, true);
        ctx.closePath();

        if (fill) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }

        if (stroke) {
            ctx.lineWidth = borderWidth;
            ctx.strokeStyle = borderColor;
            ctx.stroke();
        }

        ctx.restore();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawGrips = function (ctx, rect, grips) {
    ctx.save();
    var m = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math,
		mul = (grips.mul) ? grips.mul : 1, // for drawing grips into actual (pixel) size
		points, pt, i;

    if (grips.resize) {
        points = [
			new m.PointF(-rect.Width / 2, -rect.Height / 2),
			new m.PointF(rect.Width / 2, -rect.Height / 2),
			new m.PointF(rect.Width / 2, rect.Height / 2),
			new m.PointF(-rect.Width / 2, rect.Height / 2)
        ];
        i = 0;
        while ((pt = points[i++]) != null) {
            pt.rotate(rect.Angle);
            pt.translate(rect.CenterX, rect.CenterY);
            this.rectangle(ctx, new m.RotatedRectangleF(pt.X, pt.Y, grips.resizeGripSize / mul, grips.resizeGripSize / mul, 0), 1 / mul, grips.resizeGripLineColor, grips.resizeGripColor);
        }
    }

    if (grips.arbitraryResize) {
        points = [
			new m.PointF(-rect.Width / 2, 0),
			new m.PointF(0, -rect.Height / 2),
			new m.PointF(rect.Width / 2, 0),
			new m.PointF(0, rect.Height / 2)
        ];
        i = 0;
        while ((pt = points[i++]) != null) {
            pt.rotate(rect.Angle);
            pt.translate(rect.CenterX, rect.CenterY);
            this.rectangle(ctx, new m.RotatedRectangleF(pt.X, pt.Y, grips.resizeGripSize / mul, grips.resizeGripSize / mul, 0), 1 / mul, grips.resizeGripLineColor, grips.resizeGripColor);
        }
    }

    if (grips.rotate) {
        // allways draw the rotation grip on the top edge of the v-object
        if (rect.Height < 0)
            rect.Height = -rect.Height;

        points = [
			new m.PointF(0, -rect.Height / 2),
			new m.PointF(0, -rect.Height / 2 - grips.rotationGripLineLength / mul),
			new m.PointF(0, -rect.Height / 2 - grips.rotationGripLineLength / mul - grips.rotationGripSize / mul)
        ];
        i = 0;
        while ((pt = points[i++]) != null) {
            pt.rotate(rect.Angle);
            pt.translate(rect.CenterX, rect.CenterY);
        }
        this.drawLine(ctx, points[0].X, points[0].Y, points[1].X, points[1].Y, 0.5 / mul, grips.rotationGripLineColor);
        pt = points[2];
        this.circle(ctx, pt.X, pt.Y, grips.rotationGripSize / mul, 0.5 / mul, grips.rotationGripLineColor, grips.rotationGripColor);
    }

    ctx.restore();
}

//allow to override this function for custom selection
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawSelection =
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawSelection ||
	function (ctx, rectangle, properties) {
	    //draw selection rectangle into actual size
	    var mul = (properties.mul) ? properties.mul : 1;
	    this.drawRectangle(ctx, rectangle, properties.width / mul, properties.color);
	};

//test if color is transparent
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.isFullTransparentColor = function (color) {
    if (!color)
        return false;
    //test if color as object with A, R, G, B properties
    var a = color.A || color.a;
    if (a === 0)
        return true;
    if (typeof color === "string") {
        //parse string
        var rgba = /^\s*rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\,\s*(\d{1,}(\.\d{1,})?)\s*\)\s*;{0,1}\s*$/i;
        a = rgba.exec(color);
        if (a) {
            a = parseFloat(a[1]);
            if (a === 0)
                return true;
            else
                return false;
        }
    } else {
        return false;
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.clearCanvas = function (context, preserveTransform) {
    if (preserveTransform) {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
    }

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    if (preserveTransform) {
        context.restore();
    }
};