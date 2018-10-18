// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a text vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.TPth = vObject.get_textPath().toString();
        this.AA = vObject.get_angle();
        this.T = { ScaleX: 1, ScaleY: 1, TranslateX: 0, TranslateY: 0, Angle: vObject.get_angle() };

        this.FTP = vObject.get_fitToPath();
        this.Str = vObject.get_stretch();
        this.OFS = vObject.get_originalFontSize();
        this.FTPS = vObject.get_fitToPathStep();
        this.PS = vObject.get_pathStart();
        this.PE = vObject.get_pathEnd();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObjectData.applyState = function (textData, vObject) {
    /// <summary>Applies the <paramref name="textData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="textData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_originalTextPath(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path(textData.TPth));
        vObject.set_actualAngle(textData.AA);

        vObject.set_fitToPath(textData.FTP);
        vObject.set_stretch(textData.Str);
        vObject.set_originalFontSize(textData.OFS);
        vObject.set_fitToPathStep(textData.FTPS);
        vObject.set_pathStart(textData.PS);
        vObject.set_pathEnd(textData.PE);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData.applyState(textData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData);