// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

namespace Aurigma.Svg
{
    public class SvgStaticAttribute : SvgAttribute
    {
        public string Value { get; set; }

        public SvgStaticAttribute(string name, string value, string namespaceUri, string defaultValue)
            : base(name, defaultValue, namespaceUri, () => null, v => { })
        {
            Value = value;
        }

        public override string GetValue()
        {
            return Value;
        }

        public override void SetValue(string value)
        {
            Value = value;
        }
    }
}