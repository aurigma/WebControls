// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class AutoScaledTextVObjectData : BaseTextVObjectData
    {
        public AutoScaledTextVObjectData()
        {
        }

        public AutoScaledTextVObjectData(AutoScaledTextVObject obj) : base(obj)
        {
            IV = obj.IsVertical;
        }

        public override void ApplyState(VObject obj)
        {
            base.ApplyState(obj);

            var t = (AutoScaledTextVObject)obj;
            t.IsVertical = IV;
        }

        /// <summary>
        /// IsVertical
        /// </summary>
        public bool IV { get; set; }
    }
}