"use client";

import React from "react";
import {
  MousePointer,
  Type,
  Pen,
  Highlighter,
  Square,
  Circle,
  MoveRight,
  Image as ImageIcon,
  FileSignature,
  RotateCw,
  Trash2,
  Undo2,
  Download,
} from "lucide-react";

export type EditorToolMode =
  | "select"
  | "text"
  | "draw"
  | "highlight"
  | "rectangle"
  | "circle"
  | "arrow"
  | "image"
  | "signature";

interface EditorToolbarProps {
  currentMode: EditorToolMode;
  onSelectMode: (mode: EditorToolMode) => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  currentFontSize: number;
  onFontSizeChange: (size: number) => void;
  onUndo: () => void;
  canUndo: boolean;
  onRotatePage: () => void;
  onDeletePage: () => void;
  onExport: () => void;
  isExporting: boolean;
}

export function EditorToolbar({
  currentMode,
  onSelectMode,
  currentColor,
  onColorChange,
  currentFontSize,
  onFontSizeChange,
  onUndo,
  canUndo,
  onRotatePage,
  onDeletePage,
  onExport,
  isExporting,
}: EditorToolbarProps) {
  const tools: { mode: EditorToolMode; label: string; icon: React.ReactNode }[] = [
    { mode: "select", label: "Select", icon: <MousePointer className="h-4 w-4" /> },
    { mode: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
    { mode: "draw", label: "Draw", icon: <Pen className="h-4 w-4" /> },
    { mode: "highlight", label: "Highlight", icon: <Highlighter className="h-4 w-4" /> },
    { mode: "rectangle", label: "Box", icon: <Square className="h-4 w-4" /> },
    { mode: "circle", label: "Circle", icon: <Circle className="h-4 w-4" /> },
    { mode: "arrow", label: "Arrow", icon: <MoveRight className="h-4 w-4" /> },
    { mode: "signature", label: "Signature", icon: <FileSignature className="h-4 w-4" /> },
    { mode: "image", label: "Image", icon: <ImageIcon className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Tool Selector Buttons */}
      <div className="flex flex-wrap items-center gap-1">
        {tools.map((t) => {
          const isActive = currentMode === t.mode;
          return (
            <button
              key={t.mode}
              type="button"
              onClick={() => onSelectMode(t.mode)}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
              title={t.label}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Style Controls (Color & Font) */}
      <div className="flex items-center gap-2">
        {/* Color picker */}
        <div className="flex items-center gap-1">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent p-0"
            title="Stroke / Text Color"
          />
        </div>

        {/* Font size picker for text mode */}
        {currentMode === "text" && (
          <select
            value={currentFontSize}
            onChange={(e) => onFontSizeChange(parseInt(e.target.value, 10))}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="12">12px</option>
            <option value="14">14px</option>
            <option value="16">16px</option>
            <option value="20">20px</option>
            <option value="24">24px</option>
            <option value="32">32px</option>
          </select>
        )}

        {/* Undo button */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-800"
          title="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </button>

        {/* Page rotate */}
        <button
          type="button"
          onClick={onRotatePage}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          title="Rotate Current Page"
        >
          <RotateCw className="h-4 w-4" />
        </button>

        {/* Delete current page */}
        <button
          type="button"
          onClick={onDeletePage}
          className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          title="Delete Current Page"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        {/* Export / Download Button */}
        <button
          type="button"
          onClick={onExport}
          disabled={isExporting}
          className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-red-500/20 transition hover:bg-red-700 disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{isExporting ? "Saving..." : "Export PDF"}</span>
        </button>
      </div>
    </div>
  );
}
