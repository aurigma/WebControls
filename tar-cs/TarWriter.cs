using System;
using System.IO;

namespace tar_cs
{
    public class TarWriter : LegacyTarWriter
    {
	    private long _headerPosition = 0;

        public TarWriter(Stream writeStream) : base(writeStream)
        {
        }

	    public UsTarHeader CreateDefaultTarHeader()
	    {
		    var userName = "";
		    var groupName = "";

			return new UsTarHeader
			{
				LastModification = DateTime.Now,
				UserId = userName.GetHashCode(),
				UserName = userName,
				GroupId = groupName.GetHashCode(),
				GroupName = groupName,
				EntryType = EntryType.File
			};
	    }

        protected override void WriteHeader(string name, DateTime lastModificationTime, long count, int userId, int groupId, int mode, EntryType entryType)
        {
            var tarHeader = new UsTarHeader
            {
                FileName = name,
                LastModification = lastModificationTime,
                SizeInBytes = count,
                UserId = userId,
                UserName = Convert.ToString(userId,8),
                GroupId = groupId,
                GroupName = Convert.ToString(groupId,8),
                Mode = mode,
                EntryType = entryType
            };

			WriteHeader(tarHeader);
        }

        public virtual void WriteHeader(string name, DateTime lastModificationTime, long count, string userName, string groupName, int mode)
        {
            var tarHeader = new UsTarHeader()
            {
                FileName = name,
                LastModification = lastModificationTime,
                SizeInBytes = count,
                UserId = userName.GetHashCode(),
                UserName = userName,
                GroupId = groupName.GetHashCode(),
                GroupName = groupName,
                Mode = mode
            };

	        WriteHeader(tarHeader);
        }

	    public void WriteHeader(UsTarHeader header)
	    {
			_headerPosition = OutStream.Position;

			OutStream.Write(header.GetHeaderValue(), 0, header.HeaderSize);
	    }

	    public void RewriteHeader(UsTarHeader header)
	    {
		    var currentPosition = OutStream.Position;
		    OutStream.Position = _headerPosition;

			WriteHeader(header);

		    OutStream.Position = currentPosition;
	    }

        public virtual void Write(string name, long dataSizeInBytes, string userName, string groupName, int mode, DateTime lastModificationTime, WriteDataDelegate writeDelegate)
        {
            var writer = new DataWriter(OutStream,dataSizeInBytes);
            WriteHeader(name, lastModificationTime, dataSizeInBytes, userName, groupName, mode);
            while(writer.CanWrite)
            {
                writeDelegate(writer);
            }
            AlignTo512(dataSizeInBytes, false);
        }


        public void Write(Stream data, long dataSizeInBytes, string fileName, string userId, string groupId, int mode,
                          DateTime lastModificationTime)
        {
            WriteHeader(fileName,lastModificationTime,dataSizeInBytes,userId, groupId, mode);
            WriteContent(dataSizeInBytes,data);
            AlignTo512(dataSizeInBytes,false);
        }

		public void WriteContent(byte[] inBuffer, int offset, int count)
		{
			OutStream.Write(inBuffer, offset, count);
		}
    }
}