// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class Collection<T> : System.Collections.ObjectModel.Collection<T>
        where T : class
    {
        public void AddRange(IEnumerable<T> collection)
        {
            foreach (var item in collection)
                Add(item);
        }

        protected override void ClearItems()
        {
            var items = new T[Items.Count];
            Items.CopyTo(items, 0);
            base.ClearItems();
            OnCollectionCleared(items);
        }

        protected virtual void OnCollectionCleared(T[] items)
        {
            var handler = CollectionCleared;
            if (handler != null)
            {
                handler(this, new CollectionClearedEventArgs<T>(items));
            }
        }

        protected override void InsertItem(int index, T item)
        {
            CheckIfItemExists(item);
            base.InsertItem(index, item);
            OnItemAdded(index, item);
        }

        protected virtual void OnItemAdded(int index, T item)
        {
            var handler = ItemAdded;
            if (handler != null)
            {
                handler(this, new ItemAddedEventArgs<T>(index, item));
            }
        }

        protected override void RemoveItem(int index)
        {
            T item;
            if (index >= 0 && index < this.Count)
            {
                item = this[index];
            }
            else
            {
                item = default(T);
            }
            base.RemoveItem(index);
            OnItemRemoved(index, item);
        }

        protected virtual void OnItemRemoved(int index, T item)
        {
            var handler = ItemRemoved;
            if (handler != null)
            {
                handler(this, new ItemRemovedEventArgs<T>(index, item));
            }
        }

        protected override void SetItem(int index, T item)
        {
            throw ExceptionFactory.CollectionSetterNotSupported();
        }

        private void CheckIfItemExists(T newItem)
        {
            var itemBelongsCollection = false;
            foreach (var item in Items)
                if (ReferenceEquals(item, newItem))
                {
                    itemBelongsCollection = true;
                    break;
                }

            if (itemBelongsCollection)
                throw ExceptionFactory.ItemBelongsCollection();
        }

        public virtual T Move(int oldIndex, int newIndex)
        {
            var item = Items[oldIndex];
            Items.RemoveAt(oldIndex);
            Items.Insert(newIndex, item);
            OnItemMoved(oldIndex, newIndex, item);
            return item;
        }

        protected virtual void OnItemMoved(int oldIndex, int newIndex, T item)
        {
            var handler = ItemMoved;
            if (handler != null)
            {
                handler(this, new ItemMovedEventArgs<T>(oldIndex, newIndex, item));
            }
        }

        /// <summary>
        /// Hide default index property with setter.
        /// To get compiler error when trying to set value,
        /// instead of runtime exception.
        /// Setter still may be invoked with explicit conversion to
        /// System.Collections.ObjectModel.Collection
        /// but its setter throws NotImplementedException.
        /// </summary>
        /// <param name="index">Index of the element</param>
        /// <returns>Item from the collection at the specified index</returns>
        public new virtual T this[int index]
        {
            get { return base[index]; }
        }

        public event EventHandler<ItemAddedEventArgs<T>> ItemAdded;

        public event EventHandler<ItemRemovedEventArgs<T>> ItemRemoved;

        public event EventHandler<ItemMovedEventArgs<T>> ItemMoved;

        public event EventHandler<CollectionClearedEventArgs<T>> CollectionCleared;
    }
}