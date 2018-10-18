// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.ComponentModel;

namespace Aurigma.GraphicsMill.AjaxControls
{
    [TypeConverter(typeof(ExpandableObjectConverter))]
    public class ViewerClientSideOptions
    {
        private bool _postBackOnWorkspaceChanged;
        private bool _postBackOnWorkspaceClick;
        private bool _postBackOnScrolled;
        private bool _postBackOnZoomed;

        internal ViewerClientSideOptions()
        {
        }

        [Browsable(true)]
        [ResDescriptionAttribute("ViewerClientSideOptions_PostBackOnWorkspaceChanged")]
        [DefaultValue(false)]
        [NotifyParentProperty(true)]
        public bool PostBackOnWorkspaceChanged
        {
            get
            {
                return _postBackOnWorkspaceChanged;
            }
            set
            {
                _postBackOnWorkspaceChanged = value;
            }
        }

        [Browsable(true)]
        [ResDescriptionAttribute("ViewerClientSideOptions_PostBackOnWorkspaceClick")]
        [DefaultValue(false)]
        [NotifyParentProperty(true)]
        public bool PostBackOnWorkspaceClick
        {
            get
            {
                return _postBackOnWorkspaceClick;
            }
            set
            {
                _postBackOnWorkspaceClick = value;
            }
        }

        [Browsable(true)]
        [ResDescriptionAttribute("ViewerClientSideOptions_PostBackOnScrolled")]
        [DefaultValue(false)]
        [NotifyParentProperty(true)]
        public bool PostBackOnScrolled
        {
            get
            {
                return _postBackOnScrolled;
            }
            set
            {
                _postBackOnScrolled = value;
            }
        }

        [Browsable(true)]
        [ResDescriptionAttribute("ViewerClientSideOptions_PostBackOnZoomed")]
        [DefaultValue(false)]
        [NotifyParentProperty(true)]
        public bool PostBackOnZoomed
        {
            get
            {
                return _postBackOnZoomed;
            }
            set
            {
                _postBackOnZoomed = value;
            }
        }
    }
}