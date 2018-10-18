// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PermissionData = function (permission) {
	if (permission) {
		this.AllowDelete = permission.get_allowDelete();
		this.NoPrint = permission.get_noPrint();
		this.NoShow = permission.get_noShow();

		this.AllowMoveHorizontal = permission.get_allowMoveHorizontal();
		this.AllowMoveVertical = permission.get_allowMoveVertical();
		this.AllowRotate = permission.get_allowRotate();
		this.AllowProportionalResize = permission.get_allowProportionalResize();
		this.AllowArbitraryResize = permission.get_allowArbitraryResize();

		this.AllowEditContent = permission.get_allowEditContent();
		this.ShowEditButton = permission.get_showEditButton();
	    this.ShowSelectButton = permission.get_showSelectButton();
	}
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PermissionData.applyState = function (data, permission) {
	if (permission && data) {
		data.AllowDelete != null && (permission._allowDelete = !!data.AllowDelete);
		data.NoPrint != null && (permission._noPrint = !!data.NoPrint);
		data.NoShow != null && (permission._noShow = !!data.NoShow);

		data.AllowMoveHorizontal != null && (permission._allowMoveHorizontal = !!data.AllowMoveHorizontal);
		data.AllowMoveVertical != null && (permission._allowMoveVertical = !!data.AllowMoveVertical);
		data.AllowRotate != null && (permission._allowRotate = !!data.AllowRotate);
		data.AllowProportionalResize != null && (permission._allowProportionalResize = !!data.AllowProportionalResize);
		data.AllowArbitraryResize != null && (permission._allowArbitraryResize = !!data.AllowArbitraryResize);

		data.AllowEditContent != null && (permission._allowEditContent = !!data.AllowEditContent);
		data.ShowEditButton != null && (permission._showEditButton = !!data.ShowEditButton);
		data.ShowSelectButton != null && (permission._showSelectButton = !!data.ShowSelectButton);
	}
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PermissionData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PermissionData");