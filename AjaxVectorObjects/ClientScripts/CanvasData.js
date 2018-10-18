// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData = function (canvasObject, forService) {
    ///	<summary>This class represents a state of a canvas and allows applying this state to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    /// <field name="Layers" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection" static="true"><summary>The collection of layers associated with this canvas.</summary></field>
    /// <field name="ScreenXDpi" type="Number" static="true"><summary>The screen horizontal resolution.</summary></field>
    /// <field name="ScreenYDpi" type="Number" static="true"><summary>The screen vertical resolution.</summary></field>
    /// <field name="Zoom" type="Number" static="true"><summary>The zoom value.</summary></field>
    /// <field name="ReturnValue" type="String" static="true"><summary>The value returned by a remote scripting method.</summary></field>
    /// <field name="PreviewColorManagementEnabled" type="Boolean" static="true"><summary>The value indicating whether to use color management when displaying images.</summary></field>
    /// <field name="PrintColorManagementEnabled" type="Boolean" static="true"><summary>The value which specifies whether to use color management when rendering the workspace.</summary></field>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData.initializeBase(this);

    if (canvasObject) {
        this.RgbCPId = canvasObject._rgbColorProfileFileId;
        this.CmykCPId = canvasObject._cmykColorProfileFileId;
        this.GrayscaleCPId = canvasObject._grayscaleColorProfileFileId;
        this.PreviewCM = canvasObject.get_previewColorManagementEnabled();
        this.PrintCM = canvasObject.get_printColorManagementEnabled();
        this.PTCS = canvasObject.get_previewTargetColorSpace();
        this.Z = canvasObject.get_zoom();
        this.TDpi = canvasObject.get_targetDpi();
        this.XDpi = canvasObject.get_screenXDpi();
        this.YDpi = canvasObject.get_screenYDpi();

        if (forService === false || forService === undefined) {
            this.WW = canvasObject._workspaceWidth;
            this.WH = canvasObject._workspaceHeight;
            var layers = canvasObject.get_layers();
            this.L = [];
            this.HD = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData(canvasObject.get_history());
            for (var i = 0; i < layers.get_count() ; i++) {
                this.L.push(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData(layers.get_item(i)));
            }

            this.CSO = canvasObject.get_canvasClientSideOptions();

            this.ReGC = canvasObject.get_resizeGripColor();
            this.RoGC = canvasObject.get_rotationGripColor();
            this.ReGS = canvasObject.get_resizeGripSize();
            this.RoGS = canvasObject.get_rotationGripSize();
            this.RV = canvasObject.get_returnValue();
            this.SB = canvasObject.get_isSquaredBackground();

            this.MW = canvasObject.get_marginWidth();
            this.MC = canvasObject.get_marginColor();
            this.LRM = canvasObject.get_leftRightMargin();
            this.TBM = canvasObject.get_topBottomMargin();
            this.CM = canvasObject.get_constrainedMarginEnabled();
            this.Tags = canvasObject.get_tags();
            this.LIU = canvasObject.get_loadingImageUrl();
            this.SC = canvasObject.get_selectionColor();
            this.SW = canvasObject.get_selectionWidth();
            this.ReGLC = canvasObject.get_resizeGripLineColor();
            this.RoGLC = canvasObject.get_rotationGripLineColor();
            this.RoGLL = canvasObject.get_rotationGripLineLength();

            this.BGCC = canvasObject.get_buttonGroupCssClass();
            this.SBCC = canvasObject.get_selectButtonCssClass();
            this.EBCC = canvasObject.get_editButtonCssClass();
            this.DBCC = canvasObject.get_doneButtonCssClass();

            this.SBT = canvasObject.get_selectButtonTitle();
            this.EBT = canvasObject.get_editButtonTitle();
            this.DBT = canvasObject.get_doneButtonTitle();

            this.MSE = canvasObject.get_multipleSelectionEnabled();
            this.MMT = canvasObject.get_mouseMoveTimeout();
            this.DS = canvasObject.get_disableSmoothing();
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData.applyState = function (canvasData, canvasObject) {
    /// <summary>Applies the <paramref name="canvasData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" />.</summary>
    /// <param name="canvasData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData">The state to apply.</param>
    /// <param name="canvasObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">Canvas to apply the state to.</param>
    if ((canvasObject) && (canvasData)) {
        canvasObject._initialization = true;
        canvasObject.get_history().set_locked(true);

        canvasObject.set_workspaceSize(canvasData.WW, canvasData.WH);

        canvasObject.set_targetDpi(canvasData.TDpi);

        // Color profiles
        canvasObject._rgbColorProfileFileId = canvasData.RgbCPId;
        canvasObject._cmykColorProfileFileId = canvasData.CmykCPId;
        canvasObject._grayscaleColorProfileFileId = canvasData.GrayscaleCPId;

        //color management
        canvasObject.set_previewColorManagementEnabled(canvasData.PreviewCM);
        canvasObject.set_printColorManagementEnabled(canvasData.PrintCM);
        canvasObject.set_previewTargetColorSpace(canvasData.PTCS);

        var i, j, layer;
        //contain old VObjects and Layers
        var objectsHash = {};
        var putObject = function (o) {
            if (o.get_uniqueId)
                objectsHash[o.get_uniqueId()] = o;
        }

        var ls = canvasObject.get_layers();
        for (i = 0, lscnt = ls.get_count() ; i < lscnt; i++) {
            layer = ls.get_item(i);
            //save Layer
            putObject(layer);
            var objs = layer.get_vObjects();
            for (j = 0, objscnt = objs.get_count() ; j < objscnt; j++) {
                //save VObject
                putObject(objs.get_item(j));
            }
            objs.clear();
        }
        ls.clear();
        var layerData;
        for (var i = 0; i < canvasData.L.length; i++) {
            layerData = canvasData.L[i];
            layer = objectsHash[layerData.ID] || new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer();
            //exclude Layer object from hash
            objectsHash[layerData.ID] = null;
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData.applyState(canvasData.L[i], layer, objectsHash);
            canvasObject.get_layers().add(layer);
        }

        //dispose unused objects
        for (var k in objectsHash) {
            var o = objectsHash[k];
            if (o)
                o.dispose();
        }
        delete objectsHash;

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData.applyState(canvasData.HD, canvasObject.get_history());
        canvasObject.get_history().set_locked(false);
        canvasObject._returnValue = canvasData.RV;
        canvasObject._canvasClientSideOptions = canvasData.CSO;
        canvasObject.initialization = true;
        canvasObject.set_resizeGripColor(canvasData.ReGC);
        canvasObject.set_rotationGripColor(canvasData.RoGC);
        canvasObject.set_resizeGripSize(canvasData.ReGS);
        canvasObject.set_rotationGripSize(canvasData.RoGS);
        canvasObject.set_isSquaredBackground(canvasData.SB);
        canvasObject.set_marginColor(canvasData.MC);
        canvasObject.set_marginWidth(canvasData.MW);
        canvasObject.set_leftRightMargin(canvasData.LRM);
        canvasObject.set_topBottomMargin(canvasData.TBM);
        canvasObject.set_constrainedMarginEnabled(canvasData.CM);
        canvasObject.set_tags(canvasData.Tags);
        canvasObject.set_loadingImageUrl(canvasData.LIU);
        canvasObject.set_selectionColor(canvasData.SC);
        canvasObject.set_selectionWidth(canvasData.SW);
        canvasObject.set_resizeGripLineColor(canvasData.ReGLC);
        canvasObject.set_rotationGripLineColor(canvasData.RoGLC);
        canvasObject.set_rotationGripLineLength(canvasData.RoGLL);

        canvasObject.set_buttonGroupCssClass(canvasData.BGCC);
        canvasObject.set_selectButtonCssClass(canvasData.SBCC);
        canvasObject.set_editButtonCssClass(canvasData.EBCC);
        canvasObject.set_doneButtonCssClass(canvasData.DBCC);

        canvasObject.set_selectButtonTitle(canvasData.SBT);
        canvasObject.set_editButtonTitle(canvasData.EBT);
        canvasObject.set_doneButtonTitle(canvasData.DBT);

        canvasObject.set_multipleSelectionEnabled(canvasData.MSE);
        canvasObject.set_mouseMoveTimeout(canvasData.MMT);
        canvasObject.set_disableSmoothing(canvasData.DS);

        canvasObject._initialization = false;
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData.prototype = {
    L: [],

    XDpi: 72.0,
    YDpi: 72.0,
    Z: 1,
    RV: null,
    PreviewCM: false,
    PrintCM: false
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData", null);