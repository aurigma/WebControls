// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections.Specialized;
using System.Configuration;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    /// <summary>
    /// Provide methods to get config information from web.config.
    /// </summary>
    ///
    public abstract class BaseConfiguration
    {
        protected readonly string _sectionName;

        protected BaseConfiguration(string sectionName)
        {
            _sectionName = sectionName;
        }

        protected string GetParameter(string name)
        {
            var collection = ConfigurationManager.GetSection(_sectionName) as NameValueCollection;

            return collection == null ? null : collection[name];
        }
    }
}