// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls
{
    [Serializable()]
    public class RemoteScriptingTypeNotSupportedException : System.Exception, System.Runtime.Serialization.ISerializable
    {
        public RemoteScriptingTypeNotSupportedException()
            : base()
        {
        }

        public RemoteScriptingTypeNotSupportedException(string message)
            : base(message)
        {
        }

        public RemoteScriptingTypeNotSupportedException(string message, System.Exception innerException)
            : base(message, innerException)
        {
        }

        protected RemoteScriptingTypeNotSupportedException(System.Runtime.Serialization.SerializationInfo info,
            System.Runtime.Serialization.StreamingContext context)
            : base(info, context)
        {
        }
    }
}