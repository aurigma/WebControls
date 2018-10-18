// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.Svg;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using AdvancedPath = Aurigma.GraphicsMill.AdvancedDrawing.Path;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math
{
    public class Path : ICloneable
    {
        private class PathSegment : ICloneable
        {
            public PathSegment(string name, List<PointF> points)
            {
                Name = name;
                Points = points;
            }

            public object Clone()
            {
                var points = new List<PointF>(Points.Count);
                points.AddRange(Points.Select(point => point.Clone()));

                return new PathSegment(Name, points);
            }

            public string Name { get; private set; }
            public List<PointF> Points { get; private set; }

            public bool Equals(PathSegment obj, double tolerance = 0.0001)
            {
                if (ReferenceEquals(this, obj))
                    return true;

                if (ReferenceEquals(obj, null) || Name != obj.Name || Points.Count != obj.Points.Count)
                    return false;

                for (var i = 0; i < Points.Count; i++)
                {
                    if (!Points[i].Equals(obj.Points[i], tolerance))
                        return false;
                }

                return true;
            }

            public PathCommand ToPathCommand()
            {
                var values = new List<float>(Points.Count * 2);
                foreach (var point in Points)
                {
                    values.Add(point.X);
                    values.Add(point.Y);
                }

                return new PathCommand(Name, values);
            }

            public static PathSegment FromPathCommand(PathCommand command)
            {
                var points = new List<PointF>();
                var i = 0;
                while (i < command.Values.Count)
                {
                    points.Add(new PointF(command.Values[i], command.Values[i + 1]));
                    i += 2;
                }

                return new PathSegment(command.Command, points);
            }
        }

        private readonly List<PathSegment> _segments;

        public Path()
        {
            _segments = new List<PathSegment>();
        }

        private Path(List<PathSegment> segments)
        {
            _segments = segments;
        }

        public event EventHandler PathChanged;

        private void OnPathChanged()
        {
            var handler = PathChanged;
            if (handler != null)
            {
                handler(this, EventArgs.Empty);
            }
        }

        public object Clone()
        {
            var segments = new List<PathSegment>(_segments.Count);
            segments.AddRange(_segments.Select(segment => segment.Clone() as PathSegment));

            return new Path(segments);
        }

        public void Close()
        {
            _segments.Add(new PathSegment("Z", new List<PointF>()));
        }

        public void MoveTo(float x, float y)
        {
            MoveTo(new PointF(x, y));
        }

        public void MoveTo(PointF point)
        {
            _segments.Add(new PathSegment("M", new List<PointF> { point }));
            OnPathChanged();
        }

        public void LineTo(float x, float y)
        {
            LineTo(new PointF(x, y));
        }

        public void LineTo(PointF point)
        {
            _segments.Add(new PathSegment("L", new List<PointF> { point }));
            OnPathChanged();
        }

        public void QuadraticTo(float cx, float cy, float x, float y)
        {
            QuadraticTo(new PointF(cx, cy), new PointF(x, y));
        }

        public void QuadraticTo(PointF center, PointF endPoint)
        {
            _segments.Add(new PathSegment("Q", new List<PointF> { center, endPoint }));
            OnPathChanged();
        }

        public void CubicTo(float cx1, float cy1, float cx2, float cy2, float x, float y)
        {
            CubicTo(new PointF(cx1, cy1), new PointF(cx2, cy2), new PointF(x, y));
        }

        public void CubicTo(PointF center1, PointF center2, PointF endPoint)
        {
            _segments.Add(new PathSegment("C", new List<PointF> { center1, center2, endPoint }));
            OnPathChanged();
        }

        public bool IsEmpty
        {
            get { return _segments.Count == 0; }
        }

        public bool Equals(Path obj, double tolerance = 0.0001)
        {
            if (ReferenceEquals(this, obj))
                return true;

            if (ReferenceEquals(obj, null) || _segments.Count != obj._segments.Count)
                return false;

            for (var i = 0; i < _segments.Count; i++)
            {
                if (!_segments[i].Equals(obj._segments[i], tolerance))
                    return false;
            }

            return true;
        }

        internal void RotateAt(double angle, PointF center)
        {
            foreach (var point in _segments.SelectMany(segment => segment.Points))
            {
                point.RotateAt(angle, center);
            }
        }

        internal void Scale(double scaleX, double scaleY)
        {
            foreach (var point in _segments.SelectMany(segment => segment.Points))
            {
                point.Scale(scaleX, scaleY);
            }
        }

        internal void Translate(double x, double y)
        {
            foreach (var point in _segments.SelectMany(segment => segment.Points))
            {
                point.Translate(x, y);
            }
        }

        internal void Transform(Transform transform, PointF center)
        {
            foreach (var segment in _segments)
            {
                foreach (var point in segment.Points)
                {
                    point.Transform(transform, center);
                }
            }
        }

        internal PointF GetFirstPoint()
        {
            var firstSegement = _segments.FirstOrDefault();
            return firstSegement != null ? firstSegement.Points.First() : null;
        }

        internal static Path FromSvgString(string svg)
        {
            Path path;
            if (!string.IsNullOrEmpty(svg))
            {
                try
                {
                    var commands = PathCommand.ParseCommands(svg);
                    path = FromPathCommands(commands);
                }
                catch (Exception)
                {
                    path = new Path();
                }
            }
            else
                path = new Path();

            return path;
        }

        internal string ToSvgString()
        {
            return PathCommand.ToSvgString(ToPathCommands());
        }

        internal static Path FromSvgPath(SvgPath svgPath)
        {
            return FromPathCommands(svgPath.Path);
        }

        internal SvgPath ToSvgPath()
        {
            var svgPath = new SvgPath();
            svgPath.Path.AddRange(ToPathCommands());

            return svgPath;
        }

        internal static Path FromPathCommands(List<PathCommand> commands)
        {
            var path = new Path();
            foreach (var command in commands)
            {
                path._segments.Add(PathSegment.FromPathCommand(command));
            }

            return path;
        }

        internal List<PathCommand> ToPathCommands()
        {
            var commands = new List<PathCommand>(_segments.Count);
            commands.AddRange(_segments.Select(segment => segment.ToPathCommand()));

            return commands;
        }

        internal AdvancedPath ToAdvancedPath()
        {
            var path = new AdvancedPath();
            foreach (var segment in _segments)
            {
                switch (segment.Name.ToUpper())
                {
                    case "Z":
                        path.Close();
                        break;

                    case "M":
                        if (segment.Points.Count == 1)
                            path.MoveTo(segment.Points[0].ToPointF());
                        break;

                    case "L":
                        if (segment.Points.Count == 1)
                            path.LineTo(segment.Points[0].ToPointF());
                        break;

                    case "Q":
                        if (segment.Points.Count == 2)
                            path.CurveTo(segment.Points[0].ToPointF(), segment.Points[1].ToPointF());
                        break;

                    case "C":
                        if (segment.Points.Count == 3)
                            path.CurveTo(segment.Points[0].ToPointF(), segment.Points[1].ToPointF(), segment.Points[2].ToPointF());
                        break;
                }
            }

            return path;
        }

        internal static Path FromAdvancedPath(AdvancedPath advancedPath)
        {
            var path = new Path();

            var i = 0;
            while (i < advancedPath.Points.Count)
            {
                var point = advancedPath.Points[i];

                switch (point.Type)
                {
                    case PathPointType.Close:
                        path.Close();
                        break;

                    case PathPointType.Move:
                        path.MoveTo(point.X, point.Y);
                        break;

                    case PathPointType.Line:
                        path.LineTo(point.X, point.Y);
                        break;

                    case PathPointType.Bezier3:
                        var point1 = advancedPath.Points[i + 1];
                        if (point1.Type == PathPointType.Bezier3)
                        {
                            path.QuadraticTo(point.X, point.Y, point1.X, point1.Y);
                            i += 1;
                        }
                        else
                            path.LineTo(point.X, point.Y);
                        break;

                    case PathPointType.Bezier4:
                        point1 = advancedPath.Points[i + 1];
                        var point2 = advancedPath.Points[i + 2];
                        if (point1.Type == PathPointType.Bezier4 && point2.Type == PathPointType.Bezier4)
                        {
                            path.CubicTo(point.X, point.Y, point1.X, point1.Y, point2.X, point2.Y);
                            i += 2;
                        }
                        else
                            path.LineTo(point.X, point.Y);
                        break;
                }

                i++;
            }

            return path;
        }

        internal static Path CreateRectanglePath(float x, float y, float width, float height)
        {
            var path = new Path();
            path.MoveTo(x, y);
            path.LineTo(x + width, y);
            path.LineTo(x + width, y + height);
            path.LineTo(x, y + height);
            path.LineTo(x, y);
            path.Close();

            return path;
        }

        internal static Path CreateRectanglePath(RectangleF rectangle)
        {
            return CreateRectanglePath(rectangle.X, rectangle.Y, rectangle.Width, rectangle.Height);
        }

        internal static Path CreateEllipsePath(float x, float y, float width, float height)
        {
            const float eNumber = 0.5517f;
            var hWidth = width / 2;
            var hHeight = height / 2;

            var path = new Path();
            path.MoveTo(x, y + hHeight);
            path.CubicTo(x, y + hHeight - hHeight * eNumber, x + hWidth - hWidth * eNumber, y, x + hWidth, y);
            path.CubicTo(x + hWidth + hWidth * eNumber, y, x + width, y + hHeight * eNumber, x + width, y + hHeight);
            path.CubicTo(x + width, y + hHeight + hHeight * eNumber, x + hWidth + hWidth * eNumber, y + height, x + hWidth, y + height);
            path.CubicTo(x + hWidth - hWidth * eNumber, y + height, x, y + hHeight + hHeight * eNumber, x, y + hHeight);
            path.Close();

            return path;
        }

        internal static Path CreateEllipsePath(RectangleF rectangle)
        {
            return CreateEllipsePath(rectangle.X, rectangle.Y, rectangle.Width, rectangle.Height);
        }
    }
}