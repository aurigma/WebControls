// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class SelectableCollection<T> : Collection<T> where T : class
    {
        private int _selectedIndex = -1;

        public SelectableCollection()
        {
        }

        public T SelectedItem
        {
            get
            {
                return SelectedIndex >= 0 && SelectedIndex < Count ? this[SelectedIndex] : null;
            }
            set
            {
                var newIndex = value == null ? -1 : IndexOf(value);
                SelectedIndex = newIndex;
            }
        }

        protected virtual void OnSelectedIndexChanged(int oldIndex, int newIndex)
        {
            var handler = SelectedIndexChanged;
            if (handler != null)
            {
                handler(this, new SelectedIndexChangedEventArgs(oldIndex, newIndex));
            }
        }

        public int SelectedIndex
        {
            get
            {
                return _selectedIndex;
            }
            set
            {
                if (value < -1 || value >= Items.Count)
                {
                    throw new ArgumentOutOfRangeException("SelectedIndex");
                }

                var oldIndex = _selectedIndex;
                if (oldIndex != value)
                {
                    _selectedIndex = value;
                    OnSelectedIndexChanged(oldIndex, value);
                }
            }
        }

        protected override void ClearItems()
        {
            base.ClearItems();
            SelectedIndex = -1;
        }

        protected override void InsertItem(int index, T item)
        {
            base.InsertItem(index, item);
            if (SelectedIndex >= index)
            {
                SelectedIndex++;
            }
        }

        public override T Move(int oldIndex, int newIndex)
        {
            var item = base.Move(oldIndex, newIndex);

            int currentIndex;
            if (SelectedIndex == oldIndex)
                currentIndex = newIndex;
            else
            {
                currentIndex = SelectedIndex;
                if (currentIndex > oldIndex)
                {
                    currentIndex--;
                }
                if (currentIndex >= newIndex)
                {
                    currentIndex++;
                }
            }
            SelectedIndex = currentIndex;
            return item;
        }

        protected override void RemoveItem(int index)
        {
            base.RemoveItem(index);

            // change current index
            if (SelectedIndex == index)
            {
                // if current item was removed select last item or -1 if no items
                SelectedIndex = this.Count - 1;
            }
            else if (SelectedIndex > index)
            {
                SelectedIndex--;
            }
        }

        public event EventHandler<SelectedIndexChangedEventArgs> SelectedIndexChanged;
    }
}