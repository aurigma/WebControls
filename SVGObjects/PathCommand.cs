// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace Aurigma.Svg
{
    public class PathCommand
    {
        public string Command { get; private set; }
        public List<float> Values { get; private set; }

        public PathCommand(string command, List<float> values)
        {
            if (string.IsNullOrEmpty(command))
            {
                throw new ArgumentNullException("command");
            }
            if (values == null)
            {
                throw new ArgumentNullException("values");
            }
            Command = command;
            Values = values;
        }

        public StringBuilder ToSvgString(StringBuilder sb)
        {
            sb.Append(Command);
            if (Values.Count > 0)
            {
                var ci = CultureInfo.InvariantCulture;
                foreach (var f in Values)
                {
                    sb.Append(" ");
                    sb.Append(f.ToString(ci));
                }
            }
            return sb;
        }

        public StringBuilder ToSvgString()
        {
            var sb = new StringBuilder();
            return ToSvgString(sb);
        }

        public static string ToSvgString(List<PathCommand> commands)
        {
            var sb = new StringBuilder();
            var l = sb.Length;
            foreach (var command in commands)
            {
                command.ToSvgString(sb);

                // If new command added
                if (sb.Length > l)
                {
                    sb.Append(' ');
                    l = sb.Length;
                }
            }
            if (sb.Length > 0)
            {
                sb.Remove(sb.Length - 1, 1);
            }

            return sb.ToString();
        }

        public static PathCommand ParseCommand(string s)
        {
            var parts = s.Split(' ');
            if (parts.Length < 2)
            {
                throw new SvgParseException(Messages.IncorrectPathData);
            }
            var command = parts[0];
            var values = new List<float>(parts.Length);
            var ci = CultureInfo.InvariantCulture;
            float f;
            for (int i = 1; i < parts.Length; i++)
            {
                if (float.TryParse(parts[i], NumberStyles.Float, ci, out f))
                {
                    values.Add(f);
                }
                else
                {
                    throw new SvgParseException(Messages.IncorrectPathData);
                }
            }
            return new PathCommand(command, values);
        }

        public static List<PathCommand> ParseCommands(string s)
        {
            var parts = s.Split(' ');
            var commands = new List<PathCommand>();
            var ci = CultureInfo.InvariantCulture;

            int startIndex = 0;
            while (startIndex < parts.Length)
            {
                var commandStr = parts[startIndex];
                if (commandStr.Length != 1)
                {
                    throw new SvgParseException(Messages.IncorrectPathData);
                }
                // Assume all not float string are commands
                float f;
                int endIndex = startIndex + 1;
                var values = new List<float>();
                while (endIndex < parts.Length &&
                    float.TryParse(parts[endIndex], NumberStyles.Float, ci, out f))
                {
                    values.Add(f);
                    endIndex++;
                }

                var command = new PathCommand(commandStr, values);
                commands.Add(command);

                startIndex = endIndex;
            }

            return commands;
        }
    }
}