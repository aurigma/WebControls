// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObjectData = function (vObject) {
    ///	<summary>This class represents a state of an image vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.SrcId = vObject._sourceFileId;
        this.SrcW = vObject._sourceImageWidth;
        this.SrcH = vObject._sourceImageHeight;
        this.DI = vObject._needToDownloadImage;
        this.SAS = vObject._takeIntoAccountImageDpi;
        this.HR = vObject._privateCacheImageHorizontalResolution;
        this.VR = vObject._privateCacheImageVerticalResolution;
    }
}

// This method applies saved state (deserialized from string) to an object.
Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObjectData.applyState = function (imageData, vObject) {
    /// <summary>Applies the <paramref name="imageData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="imageData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject._sourceFileId = imageData.SrcId;
        vObject._sourceImageWidth = imageData.SrcW;
        vObject._sourceImageHeight = imageData.SrcH;
        vObject._privateCacheImageHorizontalResolution = imageData.HR;
        vObject._privateCacheImageVerticalResolution = imageData.VR;
        vObject._needToDownloadImage = imageData.DI;
        vObject._takeIntoAccountImageDpi = imageData.SAS;

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData.applyState(imageData, vObject);
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData);