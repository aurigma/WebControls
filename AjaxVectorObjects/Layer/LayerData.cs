// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;
using System.Drawing;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    [Serializable]
    public struct LayerTypeData
    {
        public LayerTypeData(string type, VObjectData data)
        {
            T = type;
            D = data;
        }

        public string T;
        public VObjectData D;
    }

    [Serializable]
    public class LayerData
    {
        public LayerData()
        {
            ID = "l" + Guid.NewGuid().ToString("N");
            N = "";
            V = true;
            L = false;
            VO = new List<LayerTypeData>();
        }

        public LayerData(Layer layer)
        {
            N = layer.Name;
            V = layer.Visible;
            L = layer.Locked;
            R = layer.Region;
            ID = layer.UniqueId;
            VO = new List<LayerTypeData>();

            foreach (var t in layer.VObjects)
            {
                VO.Add(new LayerTypeData(t.GetType().Name, t.GetVObjectData()));
            }
        }

        public void ApplyState(Layer l)
        {
            l.Name = N;
            l.Locked = L;
            l.Visible = V;
            l.Region = R;
            l.UniqueId = ID;
            l.VObjects.Clear();
            for (var i = 0; i < VO.Count; i++)
            {
                var vObjectType = typeof(VObject).Namespace + "." + VO[i].T;
                var b = Activator.CreateInstance(Type.GetType(vObjectType));
                var obj = (VObject)(b);
                VO[i].D.ApplyState(obj);
                l.VObjects.Add(obj);
            }
        }

        /// <summary>
        /// UniqueId
        /// </summary>
        public string ID { get; set; }

        /// <summary>
        /// Name
        /// </summary>
        public string N { get; set; }

        /// <summary>
        /// Region
        /// </summary>
        public RectangleF? R { get; set; }

        /// <summary>
        /// Visible
        /// </summary>
        public bool V { get; set; }

        /// <summary>
        /// Locked
        /// </summary>
        public bool L { get; set; }

        /// <summary>
        /// VObjects
        /// </summary>
        public List<LayerTypeData> VO { get; set; }
    }
}