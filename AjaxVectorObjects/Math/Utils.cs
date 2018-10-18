// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Drawing;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math
{
    public static class Utils
    {
        /// <summary>
        /// Convert degrees to radians
        /// </summary>
        /// <param name="angle">angle in degrees</param>
        /// <returns>angle in radians</returns>
        public static double ConvertDegreeToRadian(double angle)
        {
            return System.Math.PI * angle / 180.0;
        }

        /// <summary>
        /// Convert radians to degrees
        /// </summary>
        /// <param name="angle">angle in radians</param>
        /// <returns>angle in degrees</returns>
        public static double ConvertRadianToDegree(double angle)
        {
            return 180 * angle / System.Math.PI;
        }

        public static double GetAngle(double cos, double sin)
        {
            var angle = System.Math.Acos(cos) * 180 / System.Math.PI;
            if (sin < 0)
            {
                angle = 360 - angle;
            }
            return angle;
        }

        public static SizeF GetFitSize(double sourceWidth, double sourceHeight, double targetWidth, double targetHeight)
        {
            double d = System.Math.Min(targetWidth / sourceWidth, targetHeight / sourceHeight);
            return new SizeF((float)(sourceWidth * d), (float)(sourceHeight * d));
        }

        public static bool EqualsOfFloatNumbers(double f1, double f2, double tolerance = 0.0001)
        {
            return tolerance != 0 ?
                System.Math.Abs(f1 - f2) <= tolerance
                : f1 == f2;
        }

        public static bool EqualsOfPointF(System.Drawing.PointF point1, System.Drawing.PointF point2, double tolerance = 0.0001)
        {
            return EqualsOfFloatNumbers(point1.X, point2.X, tolerance) && EqualsOfFloatNumbers(point1.Y, point2.Y, tolerance);
        }

        public static bool EqualsOfRectangleF(RectangleF rect1, RectangleF rect2, double tolerance = 0.0001)
        {
            return EqualsOfFloatNumbers(rect1.X, rect2.X, tolerance) && EqualsOfFloatNumbers(rect1.Y, rect2.Y, tolerance) &&
                EqualsOfFloatNumbers(rect1.Width, rect2.Width, tolerance) && EqualsOfFloatNumbers(rect1.Height, rect2.Height, tolerance);
        }
    }
}