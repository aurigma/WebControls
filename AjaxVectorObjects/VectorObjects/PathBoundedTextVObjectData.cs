// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System.Linq;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class PathBoundedTextVObjectData : BoundedTextVObjectData
    {
        public PathBoundedTextVObjectData()
        {
        }

        public PathBoundedTextVObjectData(PathBoundedTextVObject obj)
            : base(obj)
        {
            BP = obj.BoundingPaths != null ? obj.BoundingPaths.Select(p => p.ToSvgString()).ToArray() : null;
            IV = obj.IsVertical;
        }

        public override void ApplyState(VObject obj)
        {
            base.ApplyState(obj);

            var t = (PathBoundedTextVObject)obj;
            t.BoundingPaths = BP != null ? BP.Select(Path.FromSvgString).ToArray() : null;
            t.IsVertical = IV;
        }

        /// <summary>
        /// BoundingPaths
        /// </summary>
        public string[] BP { get; set; }

        /// <summary>
        /// IsVertical
        /// </summary>
        public bool IV { get; set; }
    }
}