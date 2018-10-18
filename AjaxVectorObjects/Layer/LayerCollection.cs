// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class LayerCollection : SelectableCollection<Layer>
    {
        public ICanvas Canvas { get; private set; }

        internal LayerCollection(ICanvas canvas)
        {
            if (canvas == null)
            {
                throw ExceptionFactory.CanvasInLayerCollectionIsNull();
            }
            this.Canvas = canvas;
        }

        public Layer[] GetLayersByName(string name)
        {
            List<Layer> ll = new List<Layer>();
            for (int i = 0; i < this.Count; i++)
                if (this[i].Name == name)
                    ll.Add(this[i]);
            return ll.ToArray();
        }

        /// <summary>
        /// Get first layer with the specified name
        /// </summary>
        /// <param name="name">Layer name</param>
        /// <returns>Layer with the specified name or null if layer not found</returns>
        public Layer GetByName(string name)
        {
            return GetByName(name, 0);
        }

        /// <summary>
        /// Get first layer with the specified name
        /// </summary>
        /// <param name="name">Layer name</param>
        /// <param name="startIndex">Index to start search from</param>
        /// <returns>Layer with the specified name or null if layer not found</returns>
        public Layer GetByName(string name, int startIndex)
        {
            var count = this.Count;
            for (int i = startIndex; i < count; i++)
            {
                var layer = this[i];
                if (layer.Name == name)
                {
                    return layer;
                }
            }
            return null;
        }

        /// <summary>
        /// Search VObject among all VObjects in all layers
        /// </summary>
        public VObject[] GetVObjectsByName(string name)
        {
            List<VObject> vObjects = new List<VObject>();
            for (int i = 0; i < this.Count; i++)
            {
                for (int j = 0; j < this[i].VObjects.Count; j++)
                {
                    if (this[i].VObjects[j].Name == name)
                        vObjects.Add(this[i].VObjects[j]);
                }
            }
            return vObjects.ToArray();
        }

        protected override void ClearItems()
        {
            foreach (Layer layer in Items)
            {
                layer.Canvas = null;
            }
            base.ClearItems();
        }

        protected override void InsertItem(int index, Layer item)
        {
            // Make sure item can not be added into multiple collections
            if (item.Canvas != null)
            {
                throw ExceptionFactory.ItemBelongsCollection();
            }

            base.InsertItem(index, item);
        }

        protected override void OnItemAdded(int index, Layer item)
        {
            item.Canvas = Canvas;
            base.OnItemAdded(index, item);
        }

        protected override void OnItemRemoved(int index, Layer item)
        {
            item.Canvas = null;
            base.OnItemRemoved(index, item);
        }
    }
}