using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

namespace Svg.FilterEffects
{

	[SvgElement("feMerge")]
    public class SvgMerge : SvgFilterPrimitive
    {
        public StringCollection MergeResults { get; private set; }

        public SvgMerge()
        {
            MergeResults = new StringCollection();
        }

        public override Bitmap Process()
        {
            return null;
        }


		public override SvgElement DeepCopy()
		{
			throw new NotImplementedException();
		}

    }
}