import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import "./ImageUpload.css";

const ImageUpload = ({
  imageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/x-icon",
  ],
  fileCount = 50,
  minSize = 0,
  maxSize = Infinity,
  onUpload,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [validFiles, setValidFiles] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [unsupportedFiles, setUnsupportedFiles] = useState([]);
  const fileInputRef = useRef();
  const dropContainerRef = useRef();

  useEffect(() => {
    let filteredArray = selectedFiles.reduce((file, current) => {
      const x = file.find((item) => item.name === current.name);
      if (!x) {
        return file.concat([current]);
      } else {
        return file;
      }
    }, []);
    setValidFiles([...filteredArray]);
    const isValidState =
      unsupportedFiles.length === 0 &&
      filteredArray.length &&
      filteredArray.length <= fileCount;
    setShowUpload(isValidState);
  }, [selectedFiles]);

  const dragOver = (e) => {
    dropContainerRef.current.classList.add("drop-container--over");
    e.preventDefault();
  };

  const dragEnter = (e) => {
    dropContainerRef.current.classList.add("drop-container--over");
    e.preventDefault();
  };

  const dragLeave = (e) => {
    dropContainerRef.current.classList.remove("drop-container--over");
    e.preventDefault();
  };

  const fileDrop = (e) => {
    dropContainerRef.current.classList.remove("drop-container--over");
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const validateFile = (file) => {
    if (imageTypes.indexOf(file.type) === -1) {
      file.error = "Invalid file type.";
      return false;
    }
    const sizeInKb = file.size / 1024;
    if (sizeInKb < minSize) {
      file.error = "File too small.";
      return false;
    }
    if (sizeInKb > maxSize) {
      file.error = "File too large.";
      return false;
    }
    return true;
  };

  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      files[i].id = `image${i}_${new Date().getTime()}`;
      if (validateFile(files[i])) {
        // add to an array so we can display the name of file
        setSelectedFiles((prevArray) => [...prevArray, files[i]]);
      } else {
        // add a new property called invalid
        files[i]["invalid"] = true;
        debugger;

        // add to the same array so we can display the name of the file
        setSelectedFiles((prevArray) => [...prevArray, files[i]]);
        setUnsupportedFiles((prevArray) => [...prevArray, files[i]]);
      }
    }
  };

  const fileSize = (size) => {
    if (size === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const removeFile = (e, name) => {
    e.stopPropagation();
    // find the index of the item
    const validFileIndex = validFiles.findIndex((e) => e.name === name);
    // remove the item from array
    validFiles.splice(validFileIndex, 1);
    // update validFiles array
    setValidFiles([...validFiles]);
    const selectedFileIndex = selectedFiles.findIndex((e) => e.name === name);
    selectedFiles.splice(selectedFileIndex, 1);
    // update selectedFiles array
    setSelectedFiles([...selectedFiles]);
    const unsupportedFileIndex = unsupportedFiles.findIndex(
      (e) => e.name === name
    );
    if (unsupportedFileIndex !== -1) {
      unsupportedFiles.splice(unsupportedFileIndex, 1);
      // update unsupportedFiles array
      setUnsupportedFiles([...unsupportedFiles]);
    }
  };

  const fileInputClicked = () => {
    fileInputRef.current.click();
  };

  const filesSelected = () => {
    if (fileInputRef.current.files.length) {
      handleFiles(fileInputRef.current.files);
    }
  };

  const getImgSrc = (file) => {
    const isImage = file && file["type"].split("/")[0] === "image";
    if (isImage) {
      return URL.createObjectURL(file);
    } else {
      return "";
    }
  };

  const handleUpload = () => {
    onUpload(validFiles);
  };

  return (
    <div className="container">
      {showUpload ? (
        <button className="file-upload-btn" onClick={() => handleUpload()}>
          Upload Files
        </button>
      ) : null}
      {unsupportedFiles.length ? (
        <p>Please remove all unsupported files.</p>
      ) : validFiles.length > fileCount ? (
        <p>
          Only {fileCount} images can be uploaded at once. Remove{" "}
          {validFiles.length - fileCount} images.
        </p>
      ) : null}
      <div
        className="drop-container"
        onDragOver={dragOver}
        onDragEnter={dragEnter}
        onDragLeave={dragLeave}
        onDrop={fileDrop}
        onClick={fileInputClicked}
        ref={dropContainerRef}
      >
        <div className="drop-message">
          <div className="upload-icon"></div>
          Drag & Drop file(s) here or click to upload
        </div>
        <input
          ref={fileInputRef}
          className="file-input"
          type="file"
          multiple
          onChange={filesSelected}
        />
      </div>
      <div className="file-display-container">
        {validFiles.map((data) => (
          <div className="file-status-bar" key={data.id}>
            <img
              className="file-preview"
              src={getImgSrc(data)}
              alt="invalid file type"
            />
            <div>
              <span className={`file-name ${data.invalid ? "file-error" : ""}`}>
                {data.name}
              </span>
              <span className="file-size">({fileSize(data.size)})</span>{" "}
              {data.invalid && (
                <span className="file-error-message">({data.error})</span>
              )}
            </div>
            <div
              className="file-remove"
              onClick={(e) => removeFile(e, data.name)}
            >
              X
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ImageUpload.propTypes = {
  imageTypes: PropTypes.array,
  fileCount: PropTypes.number,
  minSize: PropTypes.number,
  maxSize: PropTypes.number,
  onUpload: PropTypes.func.isRequired,
};

export default ImageUpload;
