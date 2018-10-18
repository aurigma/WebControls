// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls
{
    /// <summary>
    /// This exception is thrown when the number of parameters passed
    /// into the remote scripting method does not match the number of
    /// parameters required by this method.
    /// </summary>
    [Serializable()]
    public class RemoteScriptingParameterCountException : System.Exception, System.Runtime.Serialization.ISerializable
    {
        public RemoteScriptingParameterCountException()
            : base()
        {
        }

        public RemoteScriptingParameterCountException(string message)
            : base(message)
        {
        }

        public RemoteScriptingParameterCountException(string message, System.Exception innerException)
            : base(message, innerException)
        {
        }

        protected RemoteScriptingParameterCountException(System.Runtime.Serialization.SerializationInfo info,
            System.Runtime.Serialization.StreamingContext context)
            : base(info, context)
        {
        }
    }
}