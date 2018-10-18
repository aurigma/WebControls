// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;

namespace Aurigma.Svg
{
    public abstract class SvgNode
    {
        private List<SvgNode> _list = new List<SvgNode>();
        private List<SvgAttribute> _customAttributes = new List<SvgAttribute>();

        public virtual List<SvgNode> ChildNodes
        {
            get { return _list; }
        }

        public abstract string Name { get; }

        public abstract string LocalName { get; }

        public virtual string NamespaceURI
        {
            get { return XmlNamespace.Svg; }
        }

        public virtual IEnumerable<SvgAttribute> GetAttributes()
        {
            foreach (var attr in _customAttributes)
            {
                yield return attr;
            }
        }

        public virtual List<SvgAttribute> CustomAttributes
        {
            get { return _customAttributes; }
        }
    }
}