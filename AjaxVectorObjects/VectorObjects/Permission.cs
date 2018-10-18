// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class Permission : IPermission
    {
        public Permission()
            : this(true)
        { }

        public Permission(bool defaultValue)
        {
            AllowDelete = defaultValue;
            NoPrint = defaultValue;
            NoShow = defaultValue;

            AllowMoveHorizontal = defaultValue;
            AllowMoveVertical = defaultValue;
            AllowRotate = defaultValue;
            AllowProportionalResize = defaultValue;
            AllowArbitraryResize = defaultValue;

            AllowEditContent = defaultValue;
            ShowEditButton = defaultValue;
            ShowSelectButton = defaultValue;
        }

        public bool Equals(IPermission other)
        {
            return AllowDelete == other.AllowDelete && NoPrint == other.NoPrint && NoShow == other.NoShow &&
                AllowMoveHorizontal == other.AllowMoveHorizontal && AllowMoveVertical == other.AllowMoveVertical &&
                AllowRotate == other.AllowRotate && AllowProportionalResize == other.AllowProportionalResize &&
                AllowArbitraryResize == other.AllowArbitraryResize &&
                AllowEditContent == other.AllowEditContent && ShowEditButton == other.ShowEditButton;
        }

        public object Clone()
        {
            return (Permission)MemberwiseClone();
        }

        public void FromActions(VObjectAction action)
        {
            AllowArbitraryResize = (action & VObjectAction.ArbitraryResize) == VObjectAction.None;
            AllowProportionalResize = (action & VObjectAction.ProportionalResize) == VObjectAction.None;
            AllowMoveHorizontal = (action & VObjectAction.DragX) == VObjectAction.None;
            AllowMoveVertical = (action & VObjectAction.DragY) == VObjectAction.None;
            AllowRotate = (action & VObjectAction.Rotate) == VObjectAction.None;
        }

        public VObjectAction ToActions()
        {
            var result = VObjectAction.None;

            if (AllowArbitraryResize)
                result |= VObjectAction.ArbitraryResize;

            if (AllowProportionalResize)
                result |= VObjectAction.ProportionalResize;

            if (AllowMoveHorizontal)
                result |= VObjectAction.DragX;

            if (AllowMoveVertical)
                result |= VObjectAction.DragY;

            if (AllowRotate)
                result |= VObjectAction.Rotate;

            return result;
        }

        #region IPermission Members

        public bool AllowDelete { get; set; }

        public bool NoPrint { get; set; }

        public bool NoShow { get; set; }

        #endregion IPermission Members

        #region ITransformPermission Members

        public bool AllowMoveHorizontal { get; set; }

        public bool AllowMoveVertical { get; set; }

        public bool AllowFreeMove
        {
            get { return AllowMoveHorizontal && AllowMoveVertical; }
        }

        public bool AllowMove
        {
            get { return AllowMoveHorizontal || AllowMoveVertical; }
        }

        public bool AllowRotate { get; set; }

        public bool AllowProportionalResize { get; set; }

        public bool AllowArbitraryResize { get; set; }

        public bool AllowResize
        {
            get { return AllowProportionalResize || AllowArbitraryResize; }
        }

        #endregion ITransformPermission Members

        #region IPlaceholderPermission

        public bool AllowEditContent { get; set; }

        public bool ShowEditButton { get; set; }

        public bool ShowSelectButton { get; set; }

        #endregion IPlaceholderPermission
    }
}