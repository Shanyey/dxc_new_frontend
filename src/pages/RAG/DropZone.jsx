import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './DropZone.css'; // Import custom CSS for styling
import TrashIcon from '../../assets/icons/trash-icon.png';

const Dropzone = ({ acceptedFileTypes, files, setFiles }) => {
  // const [droppedFiles, setDroppedFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    const filteredFiles = acceptedFiles.filter(file => acceptedFileTypes.includes(file.type));
    // Only add new files, avoiding duplicates
    // const newFiles = filteredFiles.filter(file => !droppedFiles.some(existingFile => existingFile.name === file.name));
    // setDroppedFiles(prev => [...prev, ...newFiles]);
    const newFiles = filteredFiles.filter(file => !files.some(existingFile => existingFile.name === file.name));
    setFiles(prev => [...prev, ...newFiles]);

    const rejectedFiles = acceptedFiles.filter(file => !acceptedFileTypes.includes(file.type));
    if (rejectedFiles.length > 0) {
      const rejectedFileNames = rejectedFiles.map(file => `${file.name} (${file.type})`).join(', ');
      const message = `The following files were rejected: \n${rejectedFileNames}. \nPlease provide only accepted file types.`;
      if (!window.confirm(message)) {
        return;
      }
    }
  };

  const handleDelete = (file) => {
    // const updatedFiles = droppedFiles.filter(f => f.name !== file.name);
    // setDroppedFiles(updatedFiles);
    const updatedFiles = files.filter(f => f.name !== file.name);
    setFiles(updatedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.join(','),
  });

  // useEffect(() => {
  //   onFilesAdded(droppedFiles);
  // }, [droppedFiles, onFilesAdded]);

  return (
    <div {...getRootProps({ className: 'dropzone2' })}>
      <input {...getInputProps()} />
      <div className="boxcontent">
        <p className="boxtext">Drag & Drop {acceptedFileTypes.join(', ')} files here</p>
        <p>or</p>
        <button type="button" className="browse-button">
          Browse Files
        </button>
      </div>

      <div className="dropped-files">
        {files.map((file) => (
          <div key={file.name} className="file-item">
            <span>{file.name}</span>
            <button
              type="button"
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent click event from bubbling up
                handleDelete(file);
              }}
            >
              <img src={TrashIcon} alt="Delete" className="trash-icon" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropzone;
