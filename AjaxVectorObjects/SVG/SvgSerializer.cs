// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Resources;
using Aurigma.Svg;
using System;
using System.IO;
using System.Runtime.Serialization;
using System.Xml;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class SvgSerializer : ISerializer
    {
        private const string _canvasFileName = "canvas.svg";
        private const string _iccFolder = "icc_profiles";
        private const string _cmykProfileFileName = "CmykColorProfile.icm";
        private const string _grayscaleProfileFileName = "GrayscaleColorProfile.icm";
        private const string _rgbProfileFileName = "RgbColorProfile.icm";

        public void Serialize(ICanvas canvas, Stream stream)
        {
            try
            {
                using (var storage = new TarArchive(stream, TarArchive.Mode.Create))
                {
                    var svgConverter = new SvgConverter(storage);

                    var svgDoc = svgConverter.ToSvg(canvas);
                    var xmlDoc = new XmlDocument();
                    var svgWriter = new SvgWriter(xmlDoc, new TypeResolver());
                    var svgXml = svgWriter.CreateXmlElementFromSvg(svgDoc);
                    xmlDoc.AppendChild(svgXml);
                    svgWriter.Write(svgDoc, svgXml);

                    storage.WriteToStream(_canvasFileName, s => { xmlDoc.Save(s); });

                    storage.WriteToStream(Path.Combine(_iccFolder, _cmykProfileFileName), s => { canvas.CmykColorProfile.Save(s); });
                    storage.WriteToStream(Path.Combine(_iccFolder, _grayscaleProfileFileName), s => { canvas.GrayscaleColorProfile.Save(s); });
                    storage.WriteToStream(Path.Combine(_iccFolder, _rgbProfileFileName), s => { canvas.RgbColorProfile.Save(s); });
                }
                Console.WriteLine(stream);
            }
            catch (Exception ex)
            {
                Configuration.Logger.Error(Exceptions.CanNotSerializeCanvas, ex);

                throw new SerializationException(Exceptions.CanNotSerializeCanvas, ex);
            }
        }

        public void Deserialize(Stream stream, ICanvas canvas)
        {
            try
            {
                using (var packageStorage = BaseArchive.CreateArchive(stream))
                {
                    var xmlDoc = new XmlDocument();

                    using (var outStream = packageStorage.GetReadStream(_canvasFileName))
                        xmlDoc.Load(outStream);

                    var svgReader = new SvgReader(new TypeResolver(), new VoAttributeReader());
                    var svgDoc = svgReader.CreateSvgNodeFromXml(xmlDoc.DocumentElement) as SvgDocument;
                    svgReader.Read(svgDoc, xmlDoc.DocumentElement);

                    var svgConverter = new SvgConverter(packageStorage);
                    svgConverter.FromSvg(canvas, svgDoc);

                    using (var cmykProfileStream = packageStorage.GetReadStream(Path.Combine(_iccFolder, _cmykProfileFileName)))
                        canvas.CmykColorProfile = new ColorProfile(cmykProfileStream);

                    using (var grayscaleProfileStream = packageStorage.GetReadStream(Path.Combine(_iccFolder, _grayscaleProfileFileName)))
                        canvas.GrayscaleColorProfile = new ColorProfile(grayscaleProfileStream);

                    using (var rgbProfileStream = packageStorage.GetReadStream(Path.Combine(_iccFolder, _rgbProfileFileName)))
                        canvas.RgbColorProfile = new ColorProfile(rgbProfileStream);
                }
            }
            catch (Exception ex)
            {
                Configuration.Logger.Error(Exceptions.CanNotDeserializeCanvas, ex);

                throw new SerializationException(Exceptions.CanNotDeserializeCanvas, ex);
            }
        }
    }
}