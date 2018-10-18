// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Runtime.Serialization;

namespace Aurigma.Svg
{
    public class SvgParseException : Exception
    {
        public SvgParseException()
            : this(null)
        {
        }

        public SvgParseException(string message)
            : this(message, null)
        {
        }

        public SvgParseException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        public SvgParseException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }
    }
}