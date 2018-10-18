// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class PlaceholderVObjectData : ShapeVObjectData
    {
        public PlaceholderVObjectData()
        {
        }

        public PlaceholderVObjectData(PlaceholderVObject obj)
            : base(obj)
        {
            CD = !obj.IsEmptyContent ? obj.Content.Data : null;
            CT = !obj.IsEmptyContent ? obj.Content.GetType().Name : null;
            SMC = obj.ShowMaskedContent;
            ISC = obj.IsStubContent;
        }

        public override void ApplyState(VObject obj)
        {
            base.ApplyState(obj);
            var p = (PlaceholderVObject)obj;
            p.ShowMaskedContent = SMC;
            p.IsStubContent = ISC;

            var type = CT != null ? Type.GetType(typeof(VObject).Namespace + "." + CT) : null;
            if (type == null)
                return;

            var content = (ContentVObject)Activator.CreateInstance(type);
            content.Data = CD;
            p.Content = content;
        }

        /// <summary>
        /// Content data
        /// </summary>
        public string CD { get; set; }

        /// <summary>
        /// Content type
        /// </summary>
        public string CT { get; set; }

        /// <summary>
        /// ShowMaskedContent
        /// </summary>
        public bool SMC { get; set; }

        /// <summary>
        /// IsStubContent
        /// </summary>
        public bool ISC { get; set; }
    }
}