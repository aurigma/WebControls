// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;
using System.Web.UI;

namespace Aurigma.GraphicsMill.AjaxControls
{
    public abstract class BaseScriptControl : System.Web.UI.WebControls.WebControl, IScriptControl
    {
        private ScriptManager _scriptManager;

        private string _scriptClassName;
        private List<String> _scriptFiles;
        private bool _renderState;
        private bool _excludeScripts;

        #region Public members

        public virtual bool ExcludeScripts
        {
            get { return _excludeScripts; }
            set { _excludeScripts = value; }
        }

        IEnumerable<ScriptReference> IScriptControl.GetScriptReferences()
        {
            return GetScriptReferences();
        }

        IEnumerable<ScriptDescriptor> IScriptControl.GetScriptDescriptors()
        {
            return GetScriptDescriptors();
        }

        #endregion Public members

        #region Protected members

        protected BaseScriptControl()
            : base()
        {
            _scriptClassName = "";

            _scriptFiles = new List<string>();

            if (!_excludeScripts)
                _scriptFiles.Add("Common");
        }

        protected string ScriptClassName
        {
            get
            {
                return _scriptClassName;
            }
            set
            {
                _scriptClassName = value;
            }
        }

        protected List<String> ScriptFiles
        {
            get
            {
                return _scriptFiles;
            }
        }

        protected bool RenderState
        {
            get
            {
                return _renderState;
            }
            set
            {
                _renderState = value;
            }
        }

        protected virtual IEnumerable<ScriptReference> GetScriptReferences()
        {
            var scripts = new List<ScriptReference>();

            if (!ExcludeScripts)
            {
                var assembly = typeof(BaseScriptControl).Assembly;

                foreach (var scriptFile in _scriptFiles)
                {
                    var reference = new ScriptReference
                    {
                        Assembly = assembly.FullName,
                        Name = assembly.GetName().Name + ".Resources." + scriptFile + ".js"
                    };

                    scripts.Add(reference);
                }
            }

            return scripts;
        }

        protected virtual IEnumerable<ScriptDescriptor> GetScriptDescriptors()
        {
            var descriptor = new ScriptControlDescriptor(ScriptClassName, this.ClientID);

            InitScriptDescriptor(descriptor);

            return new ScriptDescriptor[] { descriptor };
        }

        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);

            if (!DesignMode)
            {
                _scriptManager = ScriptManager.GetCurrent(Page);

                if (_scriptManager == null)
                {
                    throw new ControlNotFoundException(Resources.Messages.ScriptManagerNotFound);
                }

                _scriptManager.RegisterScriptControl(this);

                if (this.RenderState)
                {
                    Page.ClientScript.RegisterOnSubmitStatement(typeof(BaseViewer), GetStateFieldId(), "$find(\"" + this.ClientID + "\")._saveState();");
                }

                // Register client script
                Common.RegisterResourcesScripts(Page);
            }
        }

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            if (!this.DesignMode)
            {
                // on every postback we save posted state value to hidden field, so we don't loose control state if it isn't visible
                this.Page.ClientScript.RegisterHiddenField(this.GetStateFieldId(), this.Page.Request[this.GetStateFieldId()] ?? string.Empty);
            }
        }

        protected override void Render(HtmlTextWriter writer)
        {
            if (!DesignMode && _scriptManager != null)
                _scriptManager.RegisterScriptDescriptors(this);
        }

        protected virtual void InitScriptDescriptor(ScriptControlDescriptor descriptor)
        {
            if (this.RenderState)
            {
                descriptor.AddProperty("_stateFieldId", GetStateFieldId());
            }
        }

        private string _stateFieldId = null;

        protected virtual string GetStateFieldId()
        {
            if (string.IsNullOrEmpty(_stateFieldId))
                _stateFieldId = this.ClientID + "_State";
            return _stateFieldId;
        }

        #endregion Protected members
    }
}