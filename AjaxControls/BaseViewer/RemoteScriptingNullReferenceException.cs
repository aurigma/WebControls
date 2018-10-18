// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls
{
    [Serializable()]
    public class RemoteScriptingNullReferenceException : System.Exception, System.Runtime.Serialization.ISerializable
    {
        public RemoteScriptingNullReferenceException()
            : base()
        {
        }

        public RemoteScriptingNullReferenceException(string message)
            : base(message)
        {
        }

        public RemoteScriptingNullReferenceException(string message, System.Exception innerException)
            : base(message, innerException)
        {
        }

        protected RemoteScriptingNullReferenceException(System.Runtime.Serialization.SerializationInfo info,
            System.Runtime.Serialization.StreamingContext context)
            : base(info, context)
        {
        }
    }
}