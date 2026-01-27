"use client";

import React from "react";
import { 
  Trophy, 
  Cloud, 
  CheckCircle2, 
  History, 
  ScanSearch, 
  Linkedin, 
  CheckCircle,
  FileUp
} from "lucide-react";
import { ScoreBreakdown } from "@/lib/scoring";

interface UtilityBarProps {
  scoreData: ScoreBreakdown;
  mounted: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  onCloudSave: () => void;
  onShowHistory: () => void;
  onShowATS: () => void;
  onLinkedInImport: () => void;
  onImportResume: () => void;
}

export const UtilityBar = ({
  scoreData,
  mounted,
  isSaving,
  saveSuccess,
  onCloudSave,
  onShowHistory,
  onShowATS,
  onLinkedInImport,
  onImportResume,
}: UtilityBarProps) => (
  <div className="bg-white px-4 py-2 border-b border-gray-100">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {mounted ? (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-lg text-[11px] font-black text-green-700 uppercase tracking-wider">
            <Trophy className="w-3 h-3" />
            Score: {scoreData.score}%
          </div>
        ) : (
          <div className="w-16 h-5 bg-gray-100 animate-pulse rounded-lg" />
        )}

        <div className="h-4 w-px bg-gray-200 mx-1" />

        <div className="flex items-center gap-1">
          <button 
            onClick={onCloudSave}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all text-[11px] font-bold uppercase tracking-wide ${
              saveSuccess 
                ? 'text-green-600 bg-green-50' 
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            {isSaving ? (
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <Cloud className="w-3 h-3" />
            )}
            {isSaving ? 'Saving' : saveSuccess ? 'Saved' : 'Save'}
          </button>

          <button 
            onClick={onShowHistory}
            className="flex items-center gap-1.5 px-2 py-1 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all text-[11px] font-bold uppercase tracking-wide"
            title="Version History"
          >
            <History className="w-3 h-3" />
            History
          </button>

          <button 
            onClick={onShowATS}
            className="flex items-center gap-1.5 px-2 py-1 text-purple-600 hover:bg-purple-50 rounded-lg transition-all text-[11px] font-bold uppercase tracking-wide"
          >
            <ScanSearch className="w-3 h-3" />
            ATS
          </button>
        </div>
      </div>
      
      <div className="hidden lg:flex items-center gap-2 text-[10px] text-gray-400 font-medium">
        {mounted && (
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
            <span className="truncate max-w-[200px]">Tip: {scoreData.suggestions[0] || "Add more details to boost your score!"}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onImportResume}
          className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-all text-[11px] font-bold uppercase tracking-wide shadow-sm"
        >
          <FileUp className="w-3 h-3" />
          Import
        </button>

        <button 
          onClick={onLinkedInImport}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#0077b5] text-white rounded-lg hover:bg-[#006097] transition-all text-[11px] font-bold uppercase tracking-wide shadow-sm"
        >
          <Linkedin className="w-3 h-3" />
          LinkedIn
        </button>
      </div>
    </div>
  </div>
);
