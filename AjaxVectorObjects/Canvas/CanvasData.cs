// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    /// <summary>
    /// Data object to transfer canvas state between client and server
    /// and to serialize canvas state. Short property names used to
    /// optimize length of JSON serializaed data.
    /// </summary>
    [Serializable]
    internal class CanvasData
    {
        public CanvasData()
        {
            CurLI = -1;
            CurVOI = -1;
            HD = new HistoryData();
            L = new List<LayerData>();
            RgbCPId = null;
            CmykCPId = null;
            GrayscaleCPId = null;
            WH = WW = 72.0F;

            Z = 1.0F;
            XDpi = 72.0F;
            YDpi = 72.0F;
            RV = null;
            CSO = new CanvasClientSideOptions();
            SB = true;
            PreviewCM = false;
            PrintCM = false;
            MC = "rgba(100,255,100,0)";
            MW = 0F;
            M = UnitConverter.ConvertUnitsToUnits(300.0F, 0.25F, Unit.Inch, Unit.Point);
            CM = false;

            Tags = new Dictionary<string, object>();
        }

        public CanvasData(Canvas cv)
        {
            HD = new HistoryData(cv.History);
            CurLI = cv.CurrentLayerIndex;
            CurVOI = cv.CurrentVObjectIndex;
            RgbCPId = cv.RgbColorProfileFileId;
            CmykCPId = cv.CmykColorProfileFileId;
            GrayscaleCPId = cv.GrayscaleColorProfileFileId;
            PreviewCM = cv.PreviewColorManagementEnabled;
            PrintCM = cv.PrintColorManagementEnabled;
            PTCS = cv.PreviewTargetColorSpace;
            WW = cv.WorkspaceWidth;
            WH = cv.WorkspaceHeight;
            L = new List<LayerData>();
            for (int i = 0; i < cv.Layers.Count; i++)
            {
                L.Add(new LayerData(cv.Layers[i]));
            }

            Z = cv.Zoom;
            XDpi = cv.ScreenXDpi;
            YDpi = cv.ScreenYDpi;
            TDpi = cv.TargetDpi;
            ReGS = cv.ResizeGripSize;
            ReGC = Common.ConvertToWebColor(cv.ResizeGripColor);
            RoGS = cv.RotationGripSize;
            RoGC = Common.ConvertToWebColor(cv.RotationGripColor);
            CSO = cv.CanvasClientSideOptions;
            RV = cv.ReturnValue;
            SB = cv.IsSquaredBackground;
            MC = Common.ConvertToWebColor(cv.MarginColor);
            MW = cv.MarginWidth;
            LRM = cv.LeftRightMargin;
            TBM = cv.TopBottomMargin;
            CM = cv.ConstrainedMarginEnabled;
            Tags = cv.Tags;
            LIU = cv.LoadingImageUrl;
            SW = cv.SelectionWidth;
            SC = Common.ConvertToWebColor(cv.SelectionColor);
            ReGLC = Common.ConvertToWebColor(cv.ResizeGripLineColor);
            RoGLC = Common.ConvertToWebColor(cv.RotationGripLineColor);
            RoGLL = cv.RotationGripLineLength;

            BGCC = cv.ButtonGroupCssClass;
            SBCC = cv.SelectButtonCssClass;
            EBCC = cv.EditButtonCssClass;
            DBCC = cv.DoneButtonCssClass;
            SBT = cv.SelectButtonTitle;
            EBT = cv.EditButtonTitle;
            DBT = cv.DoneButtonTitle;

            MSE = cv.MultipleSelectionEnabled;
            MMT = cv.MouseMoveTimeout;
            DS = cv.DisableSmoothing;
        }

        public CanvasData(CanvasSlim cv)
        {
            RgbCPId = cv.RgbColorProfileFileId;
            CmykCPId = cv.CmykColorProfileFileId;
            GrayscaleCPId = cv.GrayscaleColorProfileFileId;
            PreviewCM = cv.PreviewColorManagementEnabled;
            PrintCM = cv.PrintColorManagementEnabled;
            PTCS = cv.PreviewTargetColorSpace;
            WW = cv.WorkspaceWidth;
            WH = cv.WorkspaceHeight;
            L = new List<LayerData>();
            for (int i = 0; i < cv.Layers.Count; i++)
            {
                L.Add(new LayerData(cv.Layers[i]));
            }

            Z = cv.Zoom;
            XDpi = cv.ScreenXDpi;
            YDpi = cv.ScreenYDpi;
            TDpi = cv.TargetDpi;
            MSE = cv.MultipleSelectionEnabled;
            MMT = cv.MouseMoveTimeout;
            DS = cv.DisableSmoothing;
            Tags = cv.Tags;
        }

        public void ApplyState(Canvas cv)
        {
            cv.IsInitialized = false;

            cv.History.Locked = true;
            cv.Layers.Clear();
            for (int i = 0; i < L.Count; i++)
            {
                Layer l = new Layer();
                L[i].ApplyState(l);
                cv.Layers.Add(l);
            }
            if (HD != null)
            {
                HD.ApplyState(cv.History);
            }
            cv.CurrentLayerIndex = CurLI;
            cv.CurrentVObjectIndex = CurVOI;
            cv.History.Locked = false;

            cv.RgbColorProfileFileId = RgbCPId;
            cv.CmykColorProfileFileId = CmykCPId;
            cv.GrayscaleColorProfileFileId = GrayscaleCPId;
            cv.PrintColorManagementEnabled = PrintCM;
            cv.PreviewColorManagementEnabled = PreviewCM;
            cv.PreviewTargetColorSpace = PTCS;

            cv.WorkspaceHeight = WH;
            cv.WorkspaceWidth = WW;
            cv.Zoom = Z;
            cv.ScreenXDpi = XDpi;
            cv.ScreenYDpi = YDpi;
            cv.TargetDpi = TDpi;
            cv.ResizeGripColor = ReGC != null ? new RgbColor(Common.ParseWebColor(ReGC)) : cv.ResizeGripColor;
            cv.ResizeGripSize = ReGS;
            cv.RotationGripColor = RoGC != null ? new RgbColor(Common.ParseWebColor(RoGC)) : cv.RotationGripColor;
            cv.RotationGripSize = RoGS;
            cv.CanvasClientSideOptions = CSO;
            cv.ReturnValue = RV;
            cv.IsSquaredBackground = SB;
            cv.MarginColor = MC != null ? new RgbColor(Common.ParseWebColor(MC)) : cv.MarginColor;
            cv.MarginWidth = MW;
            cv.ConstrainedMarginEnabled = CM;
            if (!Utils.EqualsOfFloatNumbers(0, M))
            {
                cv.Margin = M;
            }
            else
            {
                cv.LeftRightMargin = LRM;
                cv.TopBottomMargin = TBM;
            }

            cv.Tags.Clear();

            foreach (var key in Tags.Keys)
                cv.Tags[key] = Tags[key];

            cv.LoadingImageUrl = LIU;
            cv.SelectionColor = SC != null ? new RgbColor(Common.ParseWebColor(SC)) : cv.SelectionColor;
            cv.SelectionWidth = SW;
            cv.ResizeGripLineColor = ReGLC != null ? new RgbColor(Common.ParseWebColor(ReGLC)) : cv.ResizeGripLineColor;
            cv.RotationGripLineColor = RoGLC != null ? new RgbColor(Common.ParseWebColor(RoGLC)) : cv.RotationGripLineColor;
            cv.RotationGripLineLength = RoGLL;

            cv.ButtonGroupCssClass = BGCC;
            cv.SelectButtonCssClass = SBCC;
            cv.EditButtonCssClass = EBCC;
            cv.DoneButtonCssClass = DBCC;
            cv.SelectButtonTitle = SBT;
            cv.EditButtonTitle = EBT;
            cv.DoneButtonTitle = DBT;

            cv.MultipleSelectionEnabled = MSE;
            cv.MouseMoveTimeout = MMT;
            cv.DisableSmoothing = DS;

            cv.IsInitialized = true;
        }

        public void ApplyState(CanvasSlim cv)
        {
            cv.Layers.Clear();
            for (int i = 0; i < L.Count; i++)
            {
                Layer l = new Layer();
                L[i].ApplyState(l);
                cv.Layers.Add(l);
            }

            cv.RgbColorProfileFileId = RgbCPId;
            cv.CmykColorProfileFileId = CmykCPId;
            cv.GrayscaleColorProfileFileId = GrayscaleCPId;
            cv.PrintColorManagementEnabled = PrintCM;
            cv.PreviewColorManagementEnabled = PreviewCM;
            cv.PreviewTargetColorSpace = PTCS;

            cv.WorkspaceHeight = WH;
            cv.WorkspaceWidth = WW;
            cv.MultipleSelectionEnabled = MSE;
            cv.MouseMoveTimeout = MMT;
            cv.Zoom = Z;
            cv.TargetDpi = TDpi;
            cv.ScreenXDpi = XDpi;
            cv.ScreenYDpi = YDpi;
            cv.DisableSmoothing = DS;

            cv.Tags.Clear();

            foreach (var key in Tags.Keys)
                cv.Tags[key] = Tags[key];
        }

        /// <summary>
        /// HistoryData
        /// </summary>
        public HistoryData HD { get; set; }

        /// <summary>
        /// Layers
        /// </summary>
        public List<LayerData> L { get; set; }

        /// <summary>
        /// CanvasClientSideOptions
        /// </summary>
        public CanvasClientSideOptions CSO { get; set; }

        /// <summary>
        /// CurrentLayerIndex
        /// </summary>
        public int CurLI { get; set; }

        /// <summary>
        /// CurrentVObjectIndex
        /// </summary>
        public int CurVOI { get; set; }

        /// <summary>
        /// SelectionWidth
        /// </summary>
        public float SW { get; set; }

        /// <summary>
        /// SelectionColor
        /// </summary>
        public string SC { get; set; }

        /// <summary>
        /// LoadingImageUrl
        /// </summary>
        public string LIU { get; set; }

        /// <summary>
        /// WorkspaceWidth
        /// </summary>
        public float WW { get; set; }

        /// <summary>
        /// WorkspaceHeight
        /// </summary>
        public float WH { get; set; }

        /// <summary>
        /// RgbColorProfileFileId
        /// </summary>
        public string RgbCPId { get; set; }

        /// <summary>
        /// CmykColorProfileFileId
        /// </summary>
        public string CmykCPId { get; set; }

        /// <summary>
        /// GrayscaleColorProfileFileId
        /// </summary>
        public string GrayscaleCPId { get; set; }

        /// <summary>
        /// PreviewColorManagementEnabled
        /// </summary>
        public bool PreviewCM { get; set; }

        /// <summary>
        /// PrintColorManagementEnabled
        /// </summary>
        public bool PrintCM { get; set; }

        /// <summary>
        /// PreviewTargetColorSpace
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public ColorSpace? PTCS { get; set; }

        /// <summary>
        /// ConstrainedMarginEnabled
        /// </summary>
        public bool CM { get; set; }

        /// <summary>
        /// MarginColor
        /// </summary>
        public string MC { get; set; }

        /// <summary>
        /// MarginWidth
        /// </summary>
        public float MW { get; set; }

        /// <summary>
        /// Margin
        /// </summary>
        public float M { get; set; }

        /// <summary>
        /// LeftRightMargin
        /// </summary>
        public float LRM { get; set; }

        /// <summary>
        /// TopBottomMargin
        /// </summary>
        public float TBM { get; set; }

        /// <summary>
        /// IsSquaredBackground
        /// </summary>
        public bool SB { get; set; }

        /// <summary>
        /// ReturnValue
        /// </summary>
        public string RV { get; set; }

        /// <summary>
        /// Tags
        /// </summary>
        public Dictionary<string, object> Tags { get; set; }

        /// <summary>
        /// Zoom
        /// </summary>
        public float Z { get; set; }

        /// <summary>
        /// ScreenXDpi
        /// </summary>
        public float XDpi { get; set; }

        /// <summary>
        /// ScreenYDpi
        /// </summary>
        public float YDpi { get; set; }

        /// <summary>
        /// TargetDpi
        /// </summary>
        public float? TDpi { get; set; }

        /// <summary>
        /// ResizeGripSize
        /// </summary>
        public float ReGS { get; set; }

        /// <summary>
        /// ResizeGripColor
        /// </summary>
        public string ReGC { get; set; }

        /// <summary>
        /// ResizeGripLineColor
        /// </summary>
        public string ReGLC { get; set; }

        /// <summary>
        /// RotationGripSize
        /// </summary>
        public float RoGS { get; set; }

        /// <summary>
        /// RotationGripColor
        /// </summary>
        public string RoGC { get; set; }

        /// <summary>
        /// RotationGripLineLength
        /// </summary>
        public float RoGLL { get; set; }

        /// <summary>
        /// RotationGripLineColor
        /// </summary>
        public string RoGLC { get; set; }

        /// <summary>
        /// MultipleSelectionEnabled
        /// </summary>
        public bool MSE { get; set; }

        /// <summary>
        /// MouseMoveTimeout
        /// </summary>
        public int MMT { get; set; }

        /// <summary>
        /// ButtonGroupCssClass
        /// </summary>
        public string BGCC { get; set; }

        /// <summary>
        /// SelectButtonCssClass
        /// </summary>
        public string SBCC { get; set; }

        /// <summary>
        /// EditButtonCssClass
        /// </summary>
        public string EBCC { get; set; }

        /// <summary>
        /// DoneButtonCssClass
        /// </summary>
        public string DBCC { get; set; }

        /// <summary>
        /// SelectButtonTitle
        /// </summary>
        public string SBT { get; set; }

        /// <summary>
        /// EditButtonTitle
        /// </summary>
        public string EBT { get; set; }

        /// <summary>
        /// DoneButtonTitle
        /// </summary>
        public string DBT { get; set; }

        /// <summary>
        /// DisableSmoothing
        /// </summary
        public bool DS { get; set; }
    }
}