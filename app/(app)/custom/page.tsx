'use client';

import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCheck, FaCloudUploadAlt, FaSpinner, FaTimes } from "react-icons/fa";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

interface UploadedFile {
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
  file?: File;
}

const ACCEPTED_FILE_TYPES = {
  'application/octet-stream': ['.stl'],
  'model/stl': ['.stl'],
  'model/step': ['.step', '.stp'],
  'model/obj': ['.obj'],
  'application/x-tgif': ['.stl', '.obj', '.step', '.stp'],
  'text/plain': ['.obj']
};

export default function CustomPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [hasFiles, setHasFiles] = useState(false);

  const { startUpload } = useUploadThing("modelUploader", {
    onUploadProgress: (progress) => {
      setUploadedFiles(prev => {
        const newFiles = [...prev];
        const uploadingFile = newFiles.find(f => f.status === 'uploading');
        if (uploadingFile) {
          uploadingFile.progress = progress;
        }
        return [...newFiles];
      });
    }
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setHasFiles(true);
    
    // Process files one by one
    for (const file of acceptedFiles) {
      const newFile = {
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading' as const,
        file
      };
      
      setUploadedFiles(prev => [...prev, newFile]);

      try {
        const response = await startUpload([file]);
        if (!response || !response[0]?.url) throw new Error('Upload failed');

        setUploadedFiles(prev => {
          const newFiles = [...prev];
          const fileIndex = newFiles.findIndex(f => f.name === file.name && f.status === 'uploading');
          if (fileIndex !== -1 && newFiles[fileIndex]) {
            newFiles[fileIndex] = {
              ...newFiles[fileIndex],
              progress: 100,
              status: 'completed',
              url: response[0].url
            };
          }
          return newFiles;
        });
      } catch (error) {
        setUploadedFiles(prev => {
          const newFiles = [...prev];
          const fileIndex = newFiles.findIndex(f => f.name === file.name && f.status === 'uploading');
          if (fileIndex !== -1 && newFiles[fileIndex]) {
            newFiles[fileIndex] = {
              ...newFiles[fileIndex],
              progress: 0,
              status: 'error',
              error: error instanceof Error ? error.message : 'Upload failed'
            };
          }
          return newFiles;
        });
      }
    }
  }, [startUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    multiple: true,
    maxSize: 128 * 1024 * 1024 // 128MB
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative mx-auto max-w-screen-2xl px-4 py-24 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[gradient_3s_linear_infinite]" />
        </div>
        
        <div className="relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-cyan-500/10 to-cyan-500/0 border border-cyan-500/20">
              <div className="w-2 h-2 rounded-full bg-cyan-500 mr-3 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-cyan-500 uppercase">
                Custom 3D Print
              </span>
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4">
              Upload Your 3D Models
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Transform your 3D designs into reality with our professional printing service
            </p>
          </div>

          {/* Upload Area */}
          <div className="w-full max-w-7xl mx-auto">
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Dropzone */}
              <motion.div
                initial={{ width: '100%', x: '50%', marginLeft: '-50%' }}
                animate={{
                  width: hasFiles ? '100%' : '100%',
                  x: hasFiles ? '0%' : '50%',
                  marginLeft: hasFiles ? '0' : '-50%'
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`${!hasFiles ? 'md:col-span-2' : ''}`}
              >
                <div 
                  {...getRootProps()} 
                  className={`w-full rounded-lg border-2 border-dashed transition-colors duration-200 
                    ${isDragActive 
                      ? 'border-cyan-500/50 bg-cyan-500/5' 
                      : 'border-neutral-700 bg-[#1a1b1e]/80'
                    } backdrop-blur-sm p-8 cursor-pointer hover:border-cyan-500/50`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-4 text-center">
                    <FaCloudUploadAlt className={`h-16 w-16 transition-colors duration-200 ${
                      isDragActive ? 'text-cyan-400' : 'text-neutral-400'
                    }`} />
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {isDragActive 
                          ? 'Drop your files here' 
                          : 'Drop your files here or click to select'}
                      </h2>
                      <p className="mt-1 text-sm text-neutral-400">
                        You can upload multiple files at once
                      </p>
                      <p className="mt-2 text-xs text-neutral-500">
                        Supported formats: STL, STEP, OBJ (Max size: 128MB per file)
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Upload Progress List */}
              <AnimatePresence mode="popLayout">
                {uploadedFiles.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="w-full space-y-4"
                  >
                    {uploadedFiles.map((file, index) => (
                      <motion.div
                        key={file.name + index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-lg border border-neutral-800/50 bg-[#1a1b1e]/80 p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {file.status === 'uploading' && (
                              <FaSpinner className="h-4 w-4 text-cyan-400 animate-spin" />
                            )}
                            {file.status === 'completed' && (
                              <FaCheck className="h-4 w-4 text-green-400" />
                            )}
                            {file.status === 'error' && (
                              <FaTimes className="h-4 w-4 text-red-400" />
                            )}
                            <span className="text-sm font-medium text-white">{file.name}</span>
                          </div>
                          <span className="text-xs text-neutral-500">{formatFileSize(file.size)}</span>
                        </div>
                        
                        <div className="relative h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                            className={`absolute h-full rounded-full ${
                              file.status === 'error' 
                                ? 'bg-red-500' 
                                : file.status === 'completed'
                                ? 'bg-green-500'
                                : 'bg-cyan-500'
                            }`}
                          />
                        </div>
                        
                        {file.error && (
                          <p className="mt-2 text-xs text-red-400">{file.error}</p>
                        )}
                        {file.status === 'completed' && (
                          <p className="mt-2 text-xs text-green-400">Upload complete!</p>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Models Section */}
      {/* <section className="mx-auto max-w-screen-2xl px-4 pb-24">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Featured Models</h2>
          <p className="mt-1 text-neutral-400">Check out some of our most popular 3D prints</p>
        </div>
        <Carousel />
      </section> */}
    </>
  );
} 