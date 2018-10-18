using System;
using System.IO;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileStorage
{
    public interface IFileStorage : IDisposable
    {
        /// <summary>
        /// Add file to storage
        /// </summary>
        /// <returns>File id</returns>
        /// <exception cref="FileStorageException"></exception>
        string AddFile(string filePath);

        /// <summary>
        /// Add file to storage
        /// </summary>
        /// <returns>File id</returns>
        /// <exception cref="FileStorageException"></exception>
        string AddFile(string extension, Stream fileData);

        /// <summary>
        /// Add file to storage with id equal name of file
        /// </summary>
        /// <exception cref="FileStorageException"></exception>
        void AddFileWithId(string fileId, string filePath);

        /// <summary>
        /// Add file to storage with id equal name of file
        /// </summary>
        /// <exception cref="FileStorageException"></exception>
        void AddFileWithId(string fileId, Stream fileData);

        /// <summary>
        /// Return stream with file content
        /// </summary>
        /// <param name="fileId">Identifier of file in storage</param>
        /// <returns>Read only stream with file content, null if file with fileId identifier does not exists in storage, null - file not found in storage</returns>
        /// <exception cref="FileStorageException"></exception>
		Stream GetReadStream(string fileId);

        void WriteToStream(string fileId, Action<Stream> action);

        bool RemoveFile(string fileId);

        bool FileExists(string fileId);
    }

    public class FileStorageException : Exception
    {
        public FileStorageException()
        {
        }

        public FileStorageException(string message) : base(message)
        {
        }

        public FileStorageException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}