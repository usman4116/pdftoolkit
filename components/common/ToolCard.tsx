import React from "react";
import Link from "next/link";
import {
  FileDown,
  Merge,
  Split,
  PenTool,
  ScanText,
  Image,
  FileImage,
  FileText,
  FileType,
  ArrowLeftRight,
  RotateCw,
  Stamp,
  Layers,
  FileSignature,
  Unlock,
  Lock,
  Wrench,
  Crop,
  FileCode,
  ArrowRight,
} from "lucide-react";
import { ToolItem } from "@/lib/tools-data";

export function ToolCard({ tool }: { tool: ToolItem }) {
  const getIcon = (name: string) => {
    switch (name) {
      case "FileDown": return <FileDown className="h-6 w-6 text-emerald-600" />;
      case "Merge": return <Merge className="h-6 w-6 text-indigo-600" />;
      case "Split": return <Split className="h-6 w-6 text-amber-600" />;
      case "PenTool": return <PenTool className="h-6 w-6 text-violet-600" />;
      case "ScanText": return <ScanText className="h-6 w-6 text-blue-600" />;
      case "Image": return <Image className="h-6 w-6 text-pink-600" />;
      case "FileImage": return <FileImage className="h-6 w-6 text-rose-600" />;
      case "FileText": return <FileText className="h-6 w-6 text-cyan-600" />;
      case "FileType": return <FileType className="h-6 w-6 text-teal-600" />;
      case "ArrowLeftRight": return <ArrowLeftRight className="h-6 w-6 text-purple-600" />;
      case "RotateCw": return <RotateCw className="h-6 w-6 text-orange-600" />;
      case "Stamp": return <Stamp className="h-6 w-6 text-yellow-600" />;
      case "Layers": return <Layers className="h-6 w-6 text-lime-600" />;
      case "FileSignature": return <FileSignature className="h-6 w-6 text-emerald-600" />;
      case "Unlock": return <Unlock className="h-6 w-6 text-blue-500" />;
      case "Lock": return <Lock className="h-6 w-6 text-indigo-500" />;
      case "Wrench": return <Wrench className="h-6 w-6 text-slate-600" />;
      case "Crop": return <Crop className="h-6 w-6 text-amber-600" />;
      case "FileCode": return <FileCode className="h-6 w-6 text-sky-600" />;
      default: return <FileText className="h-6 w-6 text-indigo-600" />;
    }
  };

  return (
    <Link
      href={tool.href}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
    >
      {/* Soft gradient wash on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-transparent to-violet-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-indigo-950/20 dark:to-violet-950/10" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 transition-colors group-hover:bg-indigo-50 dark:bg-slate-800 dark:group-hover:bg-indigo-950/60">
            {getIcon(tool.iconName)}
          </div>
          {tool.popular && (
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Popular
            </span>
          )}
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
          {tool.name}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {tool.description}
        </p>
      </div>

      <div className="relative mt-6 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
        <span>Use Tool</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
