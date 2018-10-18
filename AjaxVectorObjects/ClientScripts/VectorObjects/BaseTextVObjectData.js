// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a text vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.Txt = vObject.get_text().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        this.F_FB = vObject.get_font().get_fauxBold();
        this.F_FI = vObject.get_font().get_fauxItalic();
        this.F_N = vObject.get_font().get_postScriptName();
        this.F_S = vObject.get_font().get_size();

        this.TC = vObject.get_textColor()._get_data();
        this.U = vObject.get_underline();
        this.A = vObject.get_alignment();
        this.Tr = vObject.get_tracking();
        this.Ld = vObject.get_leading();
        this.IRT = vObject.get_isRichText();
        this.VS = vObject.get_verticalScale();
        this.HS = vObject.get_horizontalScale();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData.applyState = function (textData, vObject) {
    /// <summary>Applies the <paramref name="textData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="textData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject._text = textData.Txt.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

        vObject._font._postScriptName = textData.F_N;
        vObject._font._size = textData.F_S;
        vObject._font._fauxBold = textData.F_FB;
        vObject._font._fauxItalic = textData.F_FI;

        vObject._textColor = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(textData.TC);
        vObject._underline = textData.U;
        vObject._alignment = textData.A;
        vObject._tracking = textData.Tr;
        vObject._leading = textData.Ld;
        vObject._isRichText = textData.IRT;
        vObject._verticalScale = textData.VS;
        vObject._horizontalScale = textData.HS;

        vObject._currentFileId = textData.CFI;
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData.applyState(textData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData);