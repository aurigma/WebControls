// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections;
using System.ComponentModel;
using System.Web.UI;

namespace Aurigma.GraphicsMill.AjaxControls
{
    /// <summary>
    /// Converts a control on the Web Forms page to a string.
    /// </summary>
    /// <remarks>
    /// This class is necessary for a design time (it enables you
    /// to select a rubberband into the Rubberband property directly
    /// from the property page).
    /// </remarks>
    public abstract class BaseControlConverter : StringConverter
    {
        protected BaseControlConverter()
        {
        }

        private object[] GetControls(IContainer container)
        {
            ComponentCollection components = container.Components;
            ArrayList result = new ArrayList();
            foreach (IComponent component in components)
            {
                if (!(component is Control))
                {
                    continue;
                }
                Control control = (Control)component;
                if ((control.ID != null) && (control.ID.Length != 0))
                {
                    if (IsTypeCorrect(control))
                    {
                        result.Add(control.ID);
                    }
                }
            }
            result.Sort(Comparer.Default);
            return result.ToArray();
        }

        public override TypeConverter.StandardValuesCollection GetStandardValues(ITypeDescriptorContext context)
        {
            if ((context != null) && (context.Container != null))
            {
                object[] result = this.GetControls(context.Container);
                if (result != null)
                {
                    return new TypeConverter.StandardValuesCollection(result);
                }
            }
            return null;
        }

        public override bool GetStandardValuesExclusive(ITypeDescriptorContext context)
        {
            return false;
        }

        public override bool GetStandardValuesSupported(ITypeDescriptorContext context)
        {
            return true;
        }

        protected abstract bool IsTypeCorrect(Control control);
    }
}