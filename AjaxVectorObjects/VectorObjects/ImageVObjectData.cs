// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class ImageVObjectData : ContentVObjectData
    {
        public ImageVObjectData()
        {
        }

        public ImageVObjectData(ImageVObject obj)
            : base(obj)
        {
            RmtUrl = obj.RemoteUrl;
            SrcId = obj.SourceFileId;
            SrcH = obj.SourceImageHeight;
            SrcW = obj.SourceImageWidth;
            HR = obj.SourceImageHorizontalResolution;
            VR = obj.SourceImageVerticalResolution;
            DI = obj.NeedToDownloadImage;
            SAS = obj.TakeIntoAccountImageDpi;
            T = obj.Transform;
            P = obj.ControlPoints;
        }

        public override void ApplyState(VObject obj)
        {
            base.ApplyState(obj);

            var i = (ImageVObject)obj;
            i.RemoteUrl = RmtUrl;
            i.SourceFileId = SrcId;
            i.SourceImageWidth = SrcW;
            i.SourceImageHeight = SrcH;
            i.SourceImageHorizontalResolution = HR;
            i.SourceImageVerticalResolution = VR;
            i.NeedToDownloadImage = DI;
            i.TakeIntoAccountImageDpi = SAS;
        }

        public bool SAS { get; set; }

        public string SrcId { get; set; }

        public string RmtUrl { get; set; }

        public int? SrcW { get; set; }

        public int? SrcH { get; set; }

        public int PubIW { get; set; }

        public int PubIH { get; set; }

        public bool DI { get; set; }

        public float HR { get; set; }

        public float VR { get; set; }
    }
}