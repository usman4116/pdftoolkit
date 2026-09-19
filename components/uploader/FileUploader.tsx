"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, File, X, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { formatBytes } from "@/lib/utils";

export interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  title?: string;
  subtitle?: string;
  onFilesSelected: (files: File[]) => void;
  isProcessing?: boolean;
  processingProgress?: number;
  processingStatusText?: string;
  onCancel?: () => void;
  className?: string;
}

export function FileUploader({
  accept = ".pdf,application/pdf",
  multiple = false,
  maxSizeMB = 100,
  title = "Drop your PDF here or click to browse",
  subtitle = "Secure client-side processing • Up to 100 MB",
  onFilesSelected,
  isProcessing = false,
  processingProgress = 0,
  processingStatusText = "Processing file...",
  onCancel,
  className = "",
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: File[]): File[] => {
    setErrorMessage(null);
    const valid: File[] = [];
    const maxBytes = maxSizeMB * 1024 * 1024;

    for (const file of files) {
      if (file.size > maxBytes) {
        setErrorMessage(`File "${file.name}" exceeds the maximum limit of ${maxSizeMB} MB.`);
        continue;
      }
      valid.push(file);
    }
    return valid;
  };

  const handleFiles = (incomingList: FileList | null) => {
    if (!incomingList || incomingList.length === 0) return;
    const fileArray = Array.from(incomingList);
    const valid = validateFiles(fileArray);

    if (valid.length > 0) {
      const finalFiles = multiple ? [...selectedFiles, ...valid] : [valid[0]];
      setSelectedFiles(finalFiles);
      onFilesSelected(finalFiles);
    }
  };

  const onDragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const onDropHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setErrorMessage(null);
    onFilesSelected([]);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onInputChange}
        className="hidden"
      />

      {/* Upload Dropzone Box */}
      {selectedFiles.length === 0 ? (
        <div
          onDragOver={onDragOverHandler}
          onDragLeave={onDragLeaveHandler}
          onDrop={onDropHandler}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-200 sm:p-12 ${
            isDragOver
              ? "border-indigo-600 bg-indigo-50/70 scale-[1.01] dark:border-indigo-400 dark:bg-indigo-950/40"
              : "border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-indigo-500"
          }`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-transform duration-200 group-hover:scale-110 dark:bg-indigo-950/60 dark:text-indigo-400">
            <UploadCloud className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100 sm:text-lg">
            {title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {subtitle}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:text-sm">
            <span>Choose File{multiple ? "s" : ""}</span>
          </div>
        </div>
      ) : (
        /* Selected Files List & State */
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected
              </span>
            </div>
            {!isProcessing && (
              <div className="flex items-center gap-2">
                {multiple && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    + Add more
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearAll}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-rose-600"
                >
                  <RefreshCw className="h-3 w-3" />
                  Replace
                </button>
              </div>
            )}
          </div>

          {/* Files Cards */}
          <div className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1">
            {selectedFiles.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-300">
                    <File className="h-4 w-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-slate-500">{formatBytes(file.size)}</p>
                  </div>
                </div>

                {!isProcessing && (
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-rose-600 dark:hover:bg-slate-700"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Processing Progress Bar */}
          {isProcessing && (
            <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950 dark:bg-indigo-950/20">
              <div className="flex items-center justify-between text-xs font-medium text-indigo-900 dark:text-indigo-200">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 animate-ping rounded-full bg-indigo-600" />
                  {processingStatusText}
                </span>
                <span>{processingProgress}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-indigo-200/60 dark:bg-indigo-900/50">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300 ease-out dark:bg-indigo-500"
                  style={{ width: `${Math.min(100, Math.max(5, processingProgress))}%` }}
                />
              </div>
              {onCancel && (
                <div className="mt-3 text-right">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="text-xs font-semibold text-slate-500 hover:text-rose-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Validation Error Message */}
      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
