// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Drawing;
using System.IO;
using System.Linq;
using PointF = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class JsonVOSerializer
    {
        private readonly JsonSerializer _serializer;
        private readonly ColorConverter _colorConverter = new ColorConverter();

        public JsonVOSerializer(ColorManagement colorManagement = null)
        {
            _colorConverter.ColorManagement = colorManagement;

            _serializer = new JsonSerializer
            {
                Converters =
                {
                    _colorConverter,
                    new PointFConverter(),
                    new RotatedRectangleFConverter(),
                    new RectangleFConverter(),
                    new VObjectDataConverter(),
                    new PlaceholderVObjectDataConverter()
                },
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            };
        }

        internal ColorManagement ColorManagement
        {
            get { return _colorConverter.ColorManagement; }
            set { _colorConverter.ColorManagement = value; }
        }

        public string Serialize(object o)
        {
            using (var writer = new StringWriter())
            {
                try
                {
                    _serializer.Serialize(writer, o);
                    return writer.ToString();
                }
                catch (Exception ex)
                {
                    Configuration.Logger.Error("Object cannot be serialized", ex);
                    throw;
                }
            }
        }

        public T Deserialize<T>(string d)
        {
            using (var stringReader = new StringReader(d))
            using (var reader = new JsonTextReader(stringReader))
            {
                try
                {
                    return _serializer.Deserialize<T>(reader);
                }
                catch (Exception ex)
                {
                    Configuration.Logger.Error("Object cannot be deserialized", ex);
                    throw;
                }
            }
        }

        public object Deserialize(string d, Type type)
        {
            using (var stringReader = new StringReader(d))
            using (var reader = new JsonTextReader(stringReader))
            {
                try
                {
                    return _serializer.Deserialize(reader, type);
                }
                catch (Exception ex)
                {
                    Configuration.Logger.Error("Object cannot be deserialized", ex);
                    throw;
                }
            }
        }

        #region ColorConverter

        public class ColorConverter : JsonConverter
        {
            private const string _typePropertyName = "__type";

            internal ColorManagement ColorManagement { get; set; }

            public ColorConverter(ColorManagement colorManagement = null)
            {
                ColorManagement = colorManagement;
            }

            public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
            {
                var colorJObject = new JObject();
                colorJObject[_typePropertyName] = value.GetType().Name;

                if (value is RgbColor)
                {
                    var color = (RgbColor)value;
                    colorJObject["R"] = color.R;
                    colorJObject["G"] = color.G;
                    colorJObject["B"] = color.B;
                    colorJObject["A"] = color.A;
                }
                else if (value is CmykColor)
                {
                    var color = (CmykColor)value;
                    colorJObject["C"] = color.C;
                    colorJObject["M"] = color.M;
                    colorJObject["Y"] = color.Y;
                    colorJObject["K"] = color.K;
                    colorJObject["A"] = color.A;
                }
                else if (value is GrayscaleColor)
                {
                    var color = (GrayscaleColor)value;
                    colorJObject["L"] = color.L;
                    colorJObject["A"] = color.A;
                }
                else
                {
                    throw new NotSupportedException(value.GetType() + " is not supported.");
                }

                var preview = ColorManagement.GetPreviewColor(ColorManagement, (Color)value);
                colorJObject["Preview"] = Common.ConvertToWebColor(preview);

                colorJObject.WriteTo(writer);
            }

            public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
            {
                var colorJObject = JObject.Load(reader);

                JToken typeToken;
                if (!colorJObject.TryGetValue(_typePropertyName, out typeToken))
                {
                    Configuration.Logger.Error(_typePropertyName + " not found");
                    return null;
                }
                var colorType = ((JValue)typeToken).Value.ToString();

                switch (colorType)
                {
                    case "RgbColor":
                        {
                            var r = colorJObject["R"].Value<byte>();
                            var g = colorJObject["G"].Value<byte>();
                            var b = colorJObject["B"].Value<byte>();
                            var a = colorJObject["A"].Value<byte>();

                            return new RgbColor(r, g, b, a);
                        }
                    case "CmykColor":
                        {
                            var c = colorJObject["C"].Value<byte>();
                            var m = colorJObject["M"].Value<byte>();
                            var y = colorJObject["Y"].Value<byte>();
                            var k = colorJObject["K"].Value<byte>();
                            var a = colorJObject["A"].Value<byte>();

                            return new CmykColor(c, m, y, k, a);
                        }
                    case "GrayscaleColor":
                        {
                            var l = colorJObject["L"].Value<byte>();
                            var a = colorJObject["A"].Value<byte>();

                            return new GrayscaleColor(l, a);
                        }
                    default:
                        throw new NotSupportedException(colorType + " is not supported.");
                }
            }

            public override bool CanConvert(Type objectType)
            {
                return typeof(Color).IsAssignableFrom(objectType);
            }
        }

        #endregion ColorConverter

        #region PointFConverter

        public class PointFConverter : JsonConverter
        {
            public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
            {
                var point = (PointF)value;
                new JsonSerializer().Serialize(writer, new { point.X, point.Y });
            }

            public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
            {
                if (reader.TokenType == JsonToken.Null)
                    return new PointF();

                var point = new PointF();
                foreach (var property in (JObject)serializer.Deserialize(reader))
                    switch (property.Key)
                    {
                        case "X":
                            point.X = property.Value.Value<float>();
                            break;

                        case "Y":
                            point.Y = property.Value.Value<float>();
                            break;
                    }

                return point;
            }

            public override bool CanConvert(Type objectType)
            {
                return objectType == typeof(PointF);
            }
        }

        #endregion PointFConverter

        #region RotatedRectangleFConverter

        public class RotatedRectangleFConverter : JsonConverter
        {
            public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
            {
                var rectangle = (RotatedRectangleF)value;
                new JsonSerializer().Serialize(writer, new { rectangle.CenterX, rectangle.CenterY, rectangle.Width, rectangle.Height, rectangle.Angle });
            }

            public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
            {
                var rectangle = new RotatedRectangleF();

                if (reader.TokenType == JsonToken.Null)
                    return rectangle;

                foreach (var property in (JObject)serializer.Deserialize(reader))
                {
                    switch (property.Key)
                    {
                        case "CenterX":
                            rectangle.CenterX = property.Value.Value<float>();
                            break;

                        case "CenterY":
                            rectangle.CenterY = property.Value.Value<float>();
                            break;

                        case "Width":
                            rectangle.Width = property.Value.Value<float>();
                            break;

                        case "Height":
                            rectangle.Height = property.Value.Value<float>();
                            break;

                        case "Angle":
                            rectangle.Angle = property.Value.Value<float>();
                            break;
                    }
                }

                return rectangle;
            }

            public override bool CanConvert(Type objectType)
            {
                return objectType == typeof(RotatedRectangleF);
            }
        }

        #endregion RotatedRectangleFConverter

        #region RectangleFConverter

        public class RectangleFConverter : JsonConverter
        {
            public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
            {
                var rectangle = (RectangleF)value;

                new JsonSerializer().Serialize(writer,
                    new { Left = rectangle.X, Top = rectangle.Y, rectangle.Width, rectangle.Height });
            }

            public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
            {
                if (reader.TokenType == JsonToken.Null)
                    return null;

                var rv = new RectangleF();
                foreach (var property in (JObject)serializer.Deserialize(reader))
                {
                    switch (property.Key)
                    {
                        case "Left":
                            rv.X = property.Value.Value<float>();
                            break;

                        case "Top":
                            rv.Y = property.Value.Value<float>();
                            break;

                        case "Width":
                            rv.Width = property.Value.Value<float>();
                            break;

                        case "Height":
                            rv.Height = property.Value.Value<float>();
                            break;
                    }
                }

                return rv;
            }

            public override bool CanConvert(Type objectType)
            {
                return objectType == typeof(RectangleF) || objectType == typeof(RectangleF?);
            }
        }

        #endregion RectangleFConverter

        #region VObjectDataConverter

        private class VObjectDataConverter : JsonConverter
        {
            private const string _typePropertyName = "__type";

            public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
            {
                serializer.Serialize(writer, value);

                var data = (VObjectData)value;

                serializer.Converters.Remove(this);

                var dataJObject = JObject.FromObject(value, serializer);
                dataJObject[_typePropertyName] = data.GetType().Name;
                dataJObject.WriteTo(writer);

                serializer.Converters.Add(this);
            }

            public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
            {
                var dataJObject = JObject.Load(reader);

                JToken typeToken;
                if (!dataJObject.TryGetValue(_typePropertyName, out typeToken))
                {
                    Configuration.Logger.Error(_typePropertyName + " not found");
                    return null;
                }

                // Backward compatibility
                var dataTypeName = typeToken.Value<string>();
                dataTypeName = dataTypeName == "RectangleVObjectData" ? "ShapeVObjectData" : dataTypeName;

                var dataType = Type.GetType(typeof(VObjectData).Namespace + "." + dataTypeName);

                serializer.Converters.Remove(this);

                var mask = dataJObject["MC"];
                if (mask != null && mask.Type == JTokenType.Object)
                    dataJObject["MC"] = mask["Preview"];

                var data = dataJObject.ToObject(dataType, serializer);

                serializer.Converters.Add(this);

                return data;
            }

            public override bool CanConvert(Type objectType)
            {
                return typeof(VObjectData).IsAssignableFrom(objectType) && objectType != typeof(PlaceholderVObjectData);
            }
        }

        #endregion VObjectDataConverter

        #region PlaceholderVObjectDataConverter

        private class PlaceholderVObjectDataConverter : JsonConverter
        {
            private const string _typePropertyName = "__type";
            private const string _contentPropertyName = "CD";

            public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
            {
                serializer.Serialize(writer, value);

                var converter = serializer.Converters.LastOrDefault(c => c is VObjectDataConverter);
                if (converter != null)
                    serializer.Converters.Remove(converter);
                serializer.Converters.Remove(this);

                var placeholderData = (PlaceholderVObjectData)value;
                var placeholderJObject = JObject.FromObject(placeholderData, serializer);

                if (placeholderData.CD != null && placeholderData.CT != null)
                {
                    var contentJObject = JObject.Parse(placeholderData.CD);
                    var contentType = typeof(VObject).Namespace + "." + placeholderData.CT;
                    var content = (ContentVObject)(Activator.CreateInstance(Type.GetType(contentType)));
                    contentJObject[_typePropertyName] = content.GetVObjectData().GetType().Name;

                    placeholderJObject[_contentPropertyName] = contentJObject;
                }

                placeholderJObject[_typePropertyName] = placeholderData.GetType().Name;
                placeholderJObject.WriteTo(writer);

                serializer.Converters.Add(this);
                if (converter != null)
                    serializer.Converters.Add(converter);
            }

            public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
            {
                var placeholderJObject = JObject.Load(reader);
                if (placeholderJObject == null)
                    return null;

                JObject contentJObject = null;
                if (placeholderJObject[_contentPropertyName] != null && placeholderJObject[_contentPropertyName].Type != JTokenType.Null)
                {
                    contentJObject = JObject.Parse(placeholderJObject[_contentPropertyName].ToString());

                    placeholderJObject[_contentPropertyName] = null;

                    JToken typeToken;
                    if (!contentJObject.TryGetValue(_typePropertyName, out typeToken))
                    {
                        Configuration.Logger.Error(_typePropertyName + " not found");
                        contentJObject = null;
                    }
                }

                var converter = serializer.Converters.LastOrDefault(c => c is VObjectDataConverter);
                if (converter != null)
                    serializer.Converters.Remove(converter);
                serializer.Converters.Remove(this);

                var placeholderData = (PlaceholderVObjectData)placeholderJObject.ToObject(typeof(PlaceholderVObjectData), serializer);
                placeholderData.CD = contentJObject != null ? contentJObject.ToString() : null;

                serializer.Converters.Add(this);
                if (converter != null)
                    serializer.Converters.Add(converter);

                return placeholderData;
            }

            public override bool CanConvert(Type objectType)
            {
                return objectType == typeof(PlaceholderVObjectData);
            }
        }

        #endregion PlaceholderVObjectDataConverter
    }
}