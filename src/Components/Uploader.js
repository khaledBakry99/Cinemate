import React from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";

function Uploader({ onFileSelect }) {
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 1000000, // 1MB
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        // إذا تم تمرير دالة للتعامل مع الملف المحدد
        if (onFileSelect) {
          onFileSelect(acceptedFiles[0]);
        }
      }
    },
  });
  return (
    <div className="w-full text-center">
      <div
        {...getRootProps()}
        className="py-8 px-6 pt-5 border-2 border-border border-dashed bg-main rounded-2xl cursor-pointer "
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex-colo text-beige3 text-3xl">
          <FiUploadCloud />
        </span>
        <p className="text-sm  mt-2 "> Drag your image here </p>
        <em className="text-xs text-border">
          (only .jpg and .png files will be accepted)
        </em>
      </div>
    </div>
  );
}

export default Uploader;
