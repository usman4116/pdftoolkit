"use client";

import React, { useState } from "react";
import { Sliders, Sparkles, ChevronDown, Check } from "lucide-react";
import { CompressionOptions } from "@/lib/pdf/compression";

interface TargetSizeInputProps {
  options: CompressionOptions;
  onChange: (options: CompressionOptions) => void;
  onCompress: () => void;
  isProcessing: boolean;
}

export function TargetSizeInput({
  options,
  onChange,
  onCompress,
  isProcessing,
}: TargetSizeInputProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const presets = [
    { label: "500 KB", value: 500, unit: "KB" as const, preset: "extreme" as const },
    { label: "1 MB", value: 1.0, unit: "MB" as const, preset: "high" as const },
    { label: "2 MB", value: 2.0, unit: "MB" as const, preset: "medium" as const },
    { label: "5 MB", value: 5.0, unit: "MB" as const, preset: "low" as const },
  ];

  const handlePresetSelect = (p: typeof presets[0]) => {
    onChange({
      ...options,
      mode: "custom",
      targetSizeValue: p.value,
      targetSizeUnit: p.unit,
      preset: p.preset,
    });
  };

  const handleCustomMode = () => {
    onChange({
      ...options,
      mode: "custom",
      targetSizeValue: options.targetSizeValue || 2.0,
      targetSizeUnit: options.targetSizeUnit || "MB",
    });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
          <Sliders className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Compression Controls
          </h3>
          <p className="text-[11px] text-slate-500">
            Define your desired output ceiling or select a preset
          </p>
        </div>
      </div>

      {/* Target File Size Control */}
      <div className="mt-5 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Target File Size
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="200"
              value={options.targetSizeValue ?? 2.0}
              onChange={(e) =>
                onChange({
                  ...options,
                  mode: "custom",
                  targetSizeValue: parseFloat(e.target.value) || 1,
                })
              }
              className="w-32 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-900 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <select
              value={options.targetSizeUnit ?? "MB"}
              onChange={(e) =>
                onChange({
                  ...options,
                  mode: "custom",
                  targetSizeUnit: e.target.value as "MB" | "KB",
                })
              }
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="MB">MB</option>
              <option value="KB">KB</option>
            </select>
          </div>
        </div>

        {/* Presets Chips */}
        <div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Presets:
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {presets.map((p) => {
              const isSelected =
                options.targetSizeValue === p.value && options.targetSizeUnit === p.unit;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handlePresetSelect(p)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-red-600 text-white shadow-sm"
                      : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                  <span>{p.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleCustomMode}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                !presets.some(
                  (p) =>
                    p.value === options.targetSizeValue &&
                    p.unit === options.targetSizeUnit
                )
                  ? "bg-red-600 text-white shadow-sm"
                  : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        {/* Quality Slider */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Visual Quality</span>
            <span>{Math.round((options.quality ?? 0.7) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={options.quality ?? 0.7}
            onChange={(e) =>
              onChange({ ...options, quality: parseFloat(e.target.value) })
            }
            className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-red-600 dark:bg-slate-700"
          />
        </div>

        {/* Image DPI Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Image Resolution (DPI)
          </label>
          <select
            value={options.dpi ?? 150}
            onChange={(e) =>
              onChange({ ...options, dpi: parseInt(e.target.value, 10) })
            }
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="72">72 DPI (Web Screen / Maximum Compression)</option>
            <option value="96">96 DPI (Email Standard)</option>
            <option value="150">150 DPI (Balanced Reading Quality)</option>
            <option value="200">200 DPI (High Quality Print)</option>
            <option value="300">300 DPI (Original Archival Quality)</option>
          </select>
        </div>

        {/* Advanced Settings Accordion */}
        <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex w-full items-center justify-between text-xs font-semibold text-slate-600 hover:text-red-600 dark:text-slate-400"
          >
            <span>Advanced Settings</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </button>

          {showAdvanced && (
            <div className="mt-3 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.downsampleImages ?? true}
                  onChange={(e) =>
                    onChange({ ...options, downsampleImages: e.target.checked })
                  }
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500 dark:border-slate-700"
                />
                <span>Downsample raster images</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.grayscale ?? false}
                  onChange={(e) =>
                    onChange({ ...options, grayscale: e.target.checked })
                  }
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500 dark:border-slate-700"
                />
                <span>Convert images to Grayscale (Saves up to 60% extra)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.removeMetadata ?? true}
                  onChange={(e) =>
                    onChange({ ...options, removeMetadata: e.target.checked })
                  }
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500 dark:border-slate-700"
                />
                <span>Strip document metadata (Author, Producer, XML)</span>
              </label>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onCompress}
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-700 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isProcessing ? "Optimizing..." : "Compress PDF"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
