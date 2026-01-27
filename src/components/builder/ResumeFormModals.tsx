"use client";

import React from "react";
import { 
  X, 
  History, 
  RotateCcw, 
  Trash2, 
  Cloud, 
  ScanSearch, 
  AlertTriangle, 
  Lightbulb, 
  Info, 
  LayoutDashboard,
  FileUp,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { ATSAnalysisResult } from "@/lib/ats-service";
import { Resume } from "@/types/resume";
import { resumeService } from "@/services/resumeService";
import { ImportParser } from "@/lib/import-parser";
import { useResumeStore } from "@/stores/resumeStore";

interface VersionHistoryModalProps {
  versions: any[];
  onClose: () => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ImportResumeModal = ({
  onClose,
  onImportSuccess,
}: {
  onClose: () => void;
  onImportSuccess: (data: Resume) => void;
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const setImportAnalysis = useResumeStore(state => state.setImportAnalysis);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/javascript",
      "text/javascript",
      "text/typescript",
      "text/x-python",
      "text/python",
    ];
    
    const isCodeFile = file.name.endsWith('.ts') || 
                       file.name.endsWith('.tsx') || 
                       file.name.endsWith('.js') || 
                       file.name.endsWith('.jsx') || 
                       file.name.endsWith('.py');

    if (!validTypes.includes(file.type) && !file.name.endsWith(".docx") && !isCodeFile) {
      setError("Please upload a PDF, DOCX, TXT, or Code file (TS, JS, PY).");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      if (isCodeFile) {
        const text = await file.text();
        const parser = new ImportParser(text, { fileName: file.name });
        const imports = parser.parse();
        
        setImportAnalysis({
          fileName: file.name,
          imports,
          rawContent: text
        });
        
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
        return;
      }

      const response = await resumeService.importResume(file);
      if (response.success && response.data) {
        setSuccess(true);
        setTimeout(() => {
          onImportSuccess(response.data!);
          onClose();
        }, 1500);
      } else {
        setError(response.message || "Failed to parse resume. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during upload. Please check your connection.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <FileUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Import Resume</h2>
              <p className="text-sm text-gray-500">Upload your PDF or Word document</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-4 text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Import Successful!</h3>
              <p className="text-gray-500 mt-1">We've extracted your information. Redirecting...</p>
            </div>
          ) : (
            <div 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer ${
                isUploading 
                  ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
                  : 'bg-indigo-50/30 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".pdf,.docx,.txt"
                disabled={isUploading}
              />
              
              {isUploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                  <p className="font-bold text-gray-700">Analyzing Resume...</p>
                  <p className="text-sm text-gray-500 mt-1 text-center">
                    Our AI is extracting your skills and experience. This may take a few seconds.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileUp className="w-8 h-8 text-indigo-500" />
                  </div>
                  <p className="font-bold text-gray-900">Click to upload or drag & drop</p>
                  <p className="text-sm text-gray-500 mt-1">PDF, DOCX, or TXT (Max 10MB)</p>
                </>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Pro Tip:</strong> Our AI works best with clean, standard resume layouts. It will automatically populate your profile, work history, and skills.
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export const VersionHistoryModal = ({ 
  versions, 
  onClose, 
  onRestore, 
  onDelete 
}: VersionHistoryModalProps) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <History className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Version History</h2>
            <p className="text-sm text-gray-500">Restore or manage previous versions of your resume</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {versions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Cloud className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No versions yet</h3>
            <p className="text-gray-500 max-w-xs mt-1">
              Save your resume to the cloud to create versions you can restore later.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.slice().reverse().map((version: any) => (
              <div 
                key={version.id}
                className="group p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {version.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {new Date(version.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onRestore(version.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-600 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore
                  </button>
                  <button 
                    onClick={() => onDelete(version.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button 
          onClick={onClose}
          className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

interface ATSModalProps {
  atsData: ATSAnalysisResult;
  onClose: () => void;
}

export const ATSModal = ({ atsData, onClose }: ATSModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-purple-600 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <ScanSearch className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">ATS Compatibility Scan</h3>
            <p className="text-purple-100 text-xs">AI-powered analysis for recruiter systems</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-8">
        <div className="flex flex-col items-center justify-center p-8 bg-purple-50 rounded-2xl border border-purple-100 text-center">
          <div className="relative mb-4">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-purple-100" />
              <circle 
                cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray={364.4}
                strokeDashoffset={364.4 * (1 - atsData.score / 100)}
                className="text-purple-600 transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-purple-900">{atsData.score}%</span>
              <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">ATS Score</span>
            </div>
          </div>
          <p className="text-sm font-medium text-purple-800">
            {atsData.score >= 80 ? "Excellent compatibility! Your resume is highly ATS-friendly." : 
             atsData.score >= 50 ? "Good start, but some critical improvements are needed." : 
             "Your resume needs significant optimization for ATS systems."}
          </p>
        </div>

        {atsData.criticalIssues.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-bold text-sm uppercase tracking-wider">Critical Issues</h4>
            </div>
            <div className="grid gap-2">
              {atsData.criticalIssues.map((issue, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <p className="text-sm text-red-800 font-medium">{issue}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {atsData.suggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600">
              <Lightbulb className="w-5 h-5" />
              <h4 className="font-bold text-sm uppercase tracking-wider">Optimization Tips</h4>
            </div>
            <div className="grid gap-2">
              {atsData.suggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <Info className="w-5 h-5 text-blue-400 shrink-0" />
                  <p className="text-sm text-blue-800">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700">
            <LayoutDashboard className="w-5 h-5" />
            <h4 className="font-bold text-sm uppercase tracking-wider">Keyword Density</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(atsData.keywordDensity).length > 0 ? (
              Object.entries(atsData.keywordDensity).map(([keyword, count], idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
                  <span className="text-xs font-bold text-gray-700">{keyword}</span>
                  <span className="text-[10px] font-black bg-white px-1.5 py-0.5 rounded border border-gray-300 text-gray-500">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No industry-standard keywords detected yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
        <button 
          onClick={onClose}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
        >
          Got it, let's fix these
        </button>
      </div>
    </div>
  </div>
);
