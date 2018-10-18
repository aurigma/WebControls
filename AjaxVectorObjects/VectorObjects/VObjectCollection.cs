// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class VObjectCollection : SelectableCollection<VObject>
    {
        internal VObjectCollection(Layer layer)
        {
            if (layer == null)
                throw ExceptionFactory.LayerInObjectCollectionIsNull();
            Layer = layer;
        }

        public VObject[] GetVObjectsByName(string name)
        {
            List<VObject> lvo = new List<VObject>();
            for (int i = 0; i < Count; i++)
                if (this[i].Name == name)
                    lvo.Add(this[i]);
            return lvo.ToArray();
        }

        public Layer Layer { get; private set; }

        protected override void ClearItems()
        {
            foreach (var vo in Items)
            {
                vo.Layer = null;
            }
            base.ClearItems();
        }

        protected override void InsertItem(int index, VObject item)
        {
            if (item.Layer != null)
            {
                throw ExceptionFactory.ItemBelongsCollection();
            }
            base.InsertItem(index, item);
        }

        protected override void OnItemAdded(int index, VObject item)
        {
            item.Layer = Layer;

            var placeholder = item as PlaceholderVObject;
            if (placeholder != null && !placeholder.IsEmptyContent)
                placeholder.Content.Layer = Layer;

            base.OnItemAdded(index, item);
        }

        protected override void OnItemRemoved(int index, VObject item)
        {
            item.Layer = null;

            var placeholder = item as PlaceholderVObject;
            if (placeholder != null && !placeholder.IsEmptyContent)
                placeholder.Content.Layer = null;

            base.OnItemRemoved(index, item);
        }
    }
}