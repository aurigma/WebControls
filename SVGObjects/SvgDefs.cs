﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

namespace Aurigma.Svg
{
    public class SvgDefs : SvgContainerElement
    {
        private readonly string _name = "defs";

        public override string LocalName
        {
            get { return _name; }
        }

        public override string Name
        {
            get { return _name; }
        }
    }
}