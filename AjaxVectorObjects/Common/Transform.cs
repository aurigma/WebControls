// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class Transform
    {
        private double _angle = 0;
        private double _scaleX = 1;
        private double _scaleY = 1;
        private double _translateX = 0;
        private double _translateY = 0;

        public Transform()
        {
        }

        public Transform(double scaleX, double scaleY, double translateX, double translateY, double angle)
        {
            _scaleX = scaleX;
            _scaleY = scaleY;
            _translateX = translateX;
            _translateY = translateY;
            _angle = angle;
        }

        public event EventHandler TransformChanged;

        private void OnTransformChanged()
        {
            var handler = TransformChanged;
            if (handler != null)
                handler(this, EventArgs.Empty);
        }

        /// <summary>
        /// Get or set rotated angle in degrees
        /// </summary>
        public double Angle
        {
            get
            {
                return _angle;
            }
            set
            {
                if (Utils.EqualsOfFloatNumbers(_angle, value))
                    return;

                _angle = value;
                OnTransformChanged();
            }
        }

        public double ScaleX
        {
            get
            {
                return _scaleX;
            }
            set
            {
                if (Utils.EqualsOfFloatNumbers(_scaleX, value))
                    return;

                _scaleX = value;
                OnTransformChanged();
            }
        }

        public double ScaleY
        {
            get
            {
                return _scaleY;
            }
            set
            {
                if (Utils.EqualsOfFloatNumbers(_scaleY, value))
                    return;

                _scaleY = value;
                OnTransformChanged();
            }
        }

        public double TranslateX
        {
            get
            {
                return _translateX;
            }
            set
            {
                if (Utils.EqualsOfFloatNumbers(_translateX, value))
                    return;

                _translateX = value;
                OnTransformChanged();
            }
        }

        public double TranslateY
        {
            get
            {
                return _translateY;
            }
            set
            {
                if (Utils.EqualsOfFloatNumbers(_translateY, value))
                    return;

                _translateY = value;
                OnTransformChanged();
            }
        }

        public Transform Clone()
        {
            return new Transform(_scaleX, _scaleY, _translateX, _translateY, _angle);
        }

        public static bool AreEqualValues(Transform transform1, Transform transform2)
        {
            return Utils.EqualsOfFloatNumbers(transform1.ScaleX, transform2.ScaleX) &&
                   Utils.EqualsOfFloatNumbers(transform1.ScaleY, transform2.ScaleY) &&
                   Utils.EqualsOfFloatNumbers(transform1.TranslateX, transform2.TranslateX) &&
                   Utils.EqualsOfFloatNumbers(transform1.TranslateY, transform2.TranslateY) &&
                   Utils.EqualsOfFloatNumbers(transform1.Angle, transform2.Angle);
        }

        public override string ToString()
        {
            return string.Format(System.Globalization.CultureInfo.InvariantCulture,
                "{{ScaleX={0}, ScaleY={1}, TranslateX={2}, TranslateY={3}, Angle={4}}}",
                _scaleX, _scaleY, _translateX, _translateY, _angle);
        }

        public void Translate(double x, double y)
        {
            if (Utils.EqualsOfFloatNumbers(0, x) && Utils.EqualsOfFloatNumbers(0, y))
                return;

            _translateX += x;
            _translateY += y;

            OnTransformChanged();
        }

        public void Scale(double dx, double dy)
        {
            if (Utils.EqualsOfFloatNumbers(1, dx) && Utils.EqualsOfFloatNumbers(1, dx))
                return;

            _scaleX *= dx;
            _scaleY *= dy;

            OnTransformChanged();
        }

        public void Rotate(double angle)
        {
            Angle += angle;
        }

        public bool IsEmpty
        {
            get
            {
                return Utils.EqualsOfFloatNumbers(_scaleX, 1) && Utils.EqualsOfFloatNumbers(_scaleY, 1) &&
                       Utils.EqualsOfFloatNumbers(_translateX, 0) && Utils.EqualsOfFloatNumbers(_translateY, 0) &&
                       Utils.EqualsOfFloatNumbers(_angle, 0);
            }
        }

        internal void Clear(bool keepAngle = false)
        {
            Update(1, 1, 0, 0, keepAngle ? null : new double?(0));
        }

        internal void Copy(Transform transform)
        {
            _scaleX = transform.ScaleX;
            _scaleY = transform.ScaleY;
            _translateX = transform.TranslateX;
            _translateY = transform.TranslateY;
            _angle = transform.Angle;
        }

        internal void Update(double? scaleX = null, double? scaleY = null, double? translateX = null, double? translateY = null, double? angle = null)
        {
            if (scaleX.HasValue)
                _scaleX = scaleX.Value;
            if (scaleY.HasValue)
                _scaleY = scaleY.Value;
            if (translateX.HasValue)
                _translateX = translateX.Value;
            if (translateY.HasValue)
                _translateY = translateY.Value;
            if (angle.HasValue)
                _angle = angle.Value;
        }
    }
}