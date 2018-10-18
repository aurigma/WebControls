// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.IO;
using System.Web.Hosting;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileStorage
{
    public class FileStorageConfiguration : BaseConfiguration
    {
        private readonly string _appDataPhysicalPath = HostingEnvironment.ApplicationPhysicalPath + "App_Data\\";

        private const string _rootPathParamaterName = "RootPath";
        private readonly string _rootPathDefault;
        private string _rootPath;

        private const string _maxSizeParameterName = "MaxSize";
        private const long _maxSizeDefault = 10737418240; // 10 GB
        private long? _maxSize;

        private const string _cleanUpIntervalParameterName = "CleanUpInterval";
        private const string _cleanUpDelaySecondsParameterName = "CleanUpDelaySeconds"; // obsolete parameter name
        private const int _cleanUpIntervalDefault = 1800; // 30 min
        private int? _cleanUpInterval;

        private const string _maxUtilizationThresholdParameterName = "MaxUtilizationThreshold";
        private const int _maxUtilizationThresholdDefault = 95; // 95%
        private int? _maxUtilizationThreshold;

        private const string _utilizationTargetParameterName = "UtilizationTarget";
        private const int _utilizationTargetDefault = 70; // 70%
        private int? _utilizationTarget;

        public FileStorageConfiguration()
            : base("Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileCacheConfiguration")
        {
            _rootPathDefault = Path.Combine(_appDataPhysicalPath, "FileCache");
        }

        public string RootPath
        {
            get
            {
                if (_rootPath != null)
                    return _rootPath;

                var value = GetParameter(_rootPathParamaterName);

                return value ?? (_rootPath = _rootPathDefault);
            }

            set { _rootPath = value; }
        }

        public long MaxSize
        {
            get
            {
                if (_maxSize != null)
                    return _maxSize.Value;

                var rawValue = GetParameter(_maxSizeParameterName);
                if (rawValue == null)
                    return (_maxSize = _maxSizeDefault).Value;

                long value;
                if (!long.TryParse(rawValue, out value))
                    throw new ConfigurationException(string.Format("Incorrect {0} parameter value {1}", _maxSizeParameterName, rawValue));

                return value;
            }

            set { _maxSize = value; }
        }

        public int CleanUpInterval
        {
            get
            {
                if (_cleanUpInterval != null)
                    return _cleanUpInterval.Value;

                var rawValue = GetParameter(_cleanUpIntervalParameterName) ?? GetParameter(_cleanUpDelaySecondsParameterName);
                if (rawValue == null)
                    return (_cleanUpInterval = _cleanUpIntervalDefault).Value;

                int value;
                if (!int.TryParse(rawValue, out value))
                    throw new ConfigurationException(string.Format("Incorrect {0} parameter value {1}", _cleanUpIntervalParameterName, rawValue));

                return value;
            }

            set { _cleanUpInterval = value; }
        }

        public int MaxUtilizationThreshold
        {
            get
            {
                if (_maxUtilizationThreshold != null)
                    return _maxUtilizationThreshold.Value;

                var rawValue = GetParameter(_maxUtilizationThresholdParameterName);
                if (rawValue == null)
                    return (_maxUtilizationThreshold = _maxUtilizationThresholdDefault).Value;

                int value;
                if (!int.TryParse(rawValue, out value))
                    throw new ConfigurationException(string.Format("Incorrect {0} parameter value {1}", _maxUtilizationThresholdParameterName, rawValue));

                return value;
            }

            set { _maxUtilizationThreshold = value; }
        }

        public int UtilizationTarget
        {
            get
            {
                if (_utilizationTarget != null)
                    return _utilizationTarget.Value;

                var rawValue = GetParameter(_utilizationTargetParameterName);
                if (rawValue == null)
                    return (_utilizationTarget = _utilizationTargetDefault).Value;

                int value;
                if (!int.TryParse(rawValue, out value))
                    throw new ConfigurationException(string.Format("Incorrect {0} parameter value {1}", _utilizationTargetParameterName, rawValue));

                return value;
            }

            set { _utilizationTarget = value; }
        }
    }
}