using System;
using System.Collections.Generic;
using System.Text;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Xml;
using System.Web.UI.WebControls;
using System.ComponentModel;

namespace Svg
{
    /// <summary>
    /// An SVG element to render circles to the document.
    /// </summary>
    [SvgElement("circle")]
    public class SvgCircle : SvgVisualElement
    {
        private GraphicsPath _path;
        
        private SvgUnit _radius;
        private SvgUnit _centerX;
        private SvgUnit _centerY;

        /// <summary>
        /// Gets the center point of the circle.
        /// </summary>
        /// <value>The center.</value>
        public SvgPoint Center
        {
            get { return new SvgPoint(this.CenterX, this.CenterY); }
        }

        [SvgAttribute("cx")]
        public virtual SvgUnit CenterX
        {
            get { return this._centerX; }
            set
            {
                this._centerX = value;
                this.IsPathDirty = true;
            }
        }

        [SvgAttribute("cy")]
        public virtual SvgUnit CenterY
        {
            get { return this._centerY; }
            set
            {
                this._centerY = value;
                this.IsPathDirty = true;
            }
        }

        [SvgAttribute("r")]
        public virtual SvgUnit Radius
        {
            get { return this._radius; }
            set { this._radius = value; this.IsPathDirty = true; }
        }

        /// <summary>
        /// Gets the bounds of the circle.
        /// </summary>
        /// <value>The rectangular bounds of the circle.</value>
        public override RectangleF Bounds
        {
            get { return this.Path.GetBounds(); }
        }

        /// <summary>
        /// Gets a value indicating whether the circle requires anti-aliasing when being rendered.
        /// </summary>
        /// <value>
        /// 	<c>true</c> if the circle requires anti-aliasing; otherwise, <c>false</c>.
        /// </value>
        protected override bool RequiresSmoothRendering
        {
            get { return true; }
        }

        /// <summary>
        /// Gets the <see cref="GraphicsPath"/> representing this element.
        /// </summary>
        public override GraphicsPath Path
        {
            get
            {
                if (this._path == null || this.IsPathDirty)
                {
                    _path = new GraphicsPath();
                    _path.StartFigure();
                    _path.AddEllipse(this.Center.ToDeviceValue().X - this.Radius.ToDeviceValue(), this.Center.ToDeviceValue().Y - this.Radius.ToDeviceValue(), 2 * this.Radius.ToDeviceValue(), 2 * this.Radius.ToDeviceValue());
                    _path.CloseFigure();
                    this.IsPathDirty = false;
                }
                return _path;
            }
            protected set
            {
                _path = value;
            }
        }

        /// <summary>
        /// Renders the circle to the specified <see cref="Graphics"/> object.
        /// </summary>
        /// <param name="graphics">The graphics object.</param>
        protected override void Render(SvgRenderer renderer)
        {
            // Don't draw if there is no radius set
            if (this.Radius.Value > 0.0f)
            {
                base.Render(renderer);
            }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="SvgCircle"/> class.
        /// </summary>
        public SvgCircle()
        {
            CenterX = new SvgUnit(0.0f);
            CenterY = new SvgUnit(0.0f);
        }


		public override SvgElement DeepCopy()
		{
			return DeepCopy<SvgCircle>();
		}

		public override SvgElement DeepCopy<T>()
		{
			var newObj = base.DeepCopy<T>() as SvgCircle;
			newObj.CenterX = this.CenterX;
			newObj.CenterY = this.CenterY;
			newObj.Radius = this.Radius;
			return newObj;
		}
    }
}