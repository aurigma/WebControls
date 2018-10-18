// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class VObjectData
    {
        public VObjectData()
        {
            ID = "vo" + Guid.NewGuid().ToString("N");
            L = false;
        }

        public VObjectData(VObject obj)
        {
            if (obj != null)
            {
                N = obj.Name;
                L = obj.Locked;
                V = obj.Visible;
                P = obj.ControlPoints;
                T = obj.Transform;
                Tg = obj.Tag;
                ID = obj.UniqueId;
                Prm = (Permission)obj.Permissions;
            }
        }

        public virtual void ApplyState(VObject obj)
        {
            obj.Name = N;
            obj.Locked = L;
            obj.Visible = V;
            obj.ControlPoints = P;
            obj.Transform.Copy(T);
            obj.Tag = Tg;
            obj.UniqueId = ID;
            obj.Permissions = Prm;
        }

        /// <summary>
        /// Using for matching server and client VObjects
        /// </summary>
        public string ID { get; set; }

        /// <summary>
        /// Control Points
        /// </summary>
        public PointF[] P { get; set; }

        /// <summary>
        /// Transform
        /// </summary>
        public Transform T { get; set; }

        /// <summary>
        /// Name
        /// </summary>
        public string N { get; set; }

        /// <summary>
        /// Visible
        /// </summary>
        public bool V { get; set; }

        /// <summary>
        /// Tag
        /// </summary>
        public object Tg { get; set; }

        /// <summary>
        /// Locked
        /// </summary>
        public bool L { get; set; }

        public Permission Prm { get; set; }
    }
}