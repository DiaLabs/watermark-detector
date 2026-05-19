'use client';

import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, X, ChevronRight, BarChart3, Image as ImageIcon } from 'lucide-react';

interface SubDetection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: number;
  ensemble_score?: number;
  ocr_text?: string;
  class_id: number;
  class_name: string;
}

interface DetectionResponse {
  original_image: string;
  annotated_image: string | null;
  heatmap_image?: string | null;
  detection_count: number;
  detections: SubDetection[];
  summary: string;
}

export const Workspace = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'annotated' | 'heatmap'>('annotated');
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
      setViewMode('annotated');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/detect-upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('Error during upload:', err);
      setError(err.message || 'An unexpected error occurred during detection.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setViewMode('annotated');
  };

  return (
    <section id="workspace" className="w-full max-w-7xl mx-auto px-6 py-12 relative z-10">
      <div className="w-full bg-white border border-[#E0DDF7] rounded-[2.5rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(92,74,211,0.03)] relative overflow-hidden">
        
        {/* Header inside Workspace */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
          <div>
            <h2 className="text-[24px] md:text-[28px] font-bold text-[#1E1B4B] tight-tracking mb-2">Detect Watermarks in Your Image</h2>
            <p className="text-[14px] text-slate-500 font-medium">Upload an image and let our AI find hidden or visible watermarks.</p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0 self-start md:self-center">
            {file && (
              <button 
                onClick={reset}
                className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-800 transition-colors mr-2"
              >
                <X size={16} />
                Reset Workspace
              </button>
            )}
            {/* Target/Shield decoration icon from the Figma mockup */}
            <div className="w-10 h-10 rounded-full bg-[#5C4AD3]/5 text-[#5C4AD3] flex items-center justify-center border border-[#5C4AD3]/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 text-red-800">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Card (Left) */}
          <div className="h-full min-h-[400px]">
            {!file ? (
              <div className="h-full border-2 border-dotted border-[#5C4AD3] bg-white rounded-[2rem] p-10 flex flex-col items-center justify-center text-center hover:bg-[#5C4AD3]/3 hover:border-[#4B3BC2] transition-all cursor-pointer relative group min-h-[380px]">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                
                {/* Solid Purple Upload Cloud Icon */}
                <div className="mb-6 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-20 h-20 text-[#5C4AD3] drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                  </svg>
                </div>
                
                <h3 className="text-base md:text-lg font-bold text-[#1E1B4B] mb-2">Drag & drop your image here</h3>
                <p className="text-xs text-slate-400 font-medium mb-6">or</p>
                
                {/* Custom Upload Button with rounded corners, not pill */}
                <button className="bg-[#5C4AD3] hover:bg-[#4B3BC2] text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-sm transition-all pointer-events-none relative z-0">
                  Upload Image
                </button>
                
                <p className="text-xs text-slate-400 font-medium mt-8">Supports: JPG, PNG, WEBP • Max size: 20MB</p>
              </div>
            ) : (
              <div className="h-full flex flex-col space-y-4">
                <div className="flex-1 border-2 border-slate-100 rounded-[2rem] overflow-hidden flex items-center justify-center bg-slate-50 relative group shadow-inner">
                  <img src={preview!} alt="Original" className="max-w-full max-h-[400px] object-contain rounded-lg p-2" />
                  {!result && (
                     <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="bg-white text-slate-800 text-sm font-bold px-4 py-2 rounded-full shadow-sm">Input Image</span>
                     </div>
                  )}
                </div>
                {!result && (
                  <button 
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full brand-gradient text-white text-lg font-bold px-6 py-4 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Detect Watermarks
                        <ChevronRight size={20} />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Result Card (Right) */}
          <div className="h-full min-h-[400px]">
            {!result ? (
              <div className="h-full border border-slate-100 bg-slate-50/50 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center opacity-50">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                    <ImageIcon size={32} />
                 </div>
                 <p className="text-slate-400 font-medium">Result Preview Card</p>
              </div>
            ) : (
              <div className="h-full flex flex-col space-y-4">
                <div className="flex-1 border-2 border-slate-100 rounded-[2rem] overflow-hidden flex items-center justify-center bg-slate-900 relative shadow-inner p-2 group">
                   
                   {/* Badges and Toggles overlay */}
                   <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                     <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${result.detection_count > 0 ? 'bg-success/10 text-success border border-success/20' : 'bg-slate-800 text-slate-300'}`}>
                        {result.detection_count > 0 ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        {result.detection_count > 0 ? 'Watermark Detected' : 'No Watermark'}
                     </span>
                   </div>

                   {result.heatmap_image && (
                     <div className="absolute top-4 right-4 z-10 flex items-center bg-slate-800/80 backdrop-blur p-1 rounded-lg border border-slate-700/50 shadow-lg">
                        <button 
                          onClick={() => setViewMode('annotated')}
                          className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${viewMode === 'annotated' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                          Annotated
                        </button>
                        <button 
                          onClick={() => setViewMode('heatmap')}
                          className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${viewMode === 'heatmap' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                          Heatmap
                        </button>
                     </div>
                   )}

                  {result.annotated_image ? (
                    <img 
                      src={viewMode === 'heatmap' && result.heatmap_image ? result.heatmap_image : result.annotated_image} 
                      alt="Analysis Output" 
                      className="max-w-full max-h-[400px] object-contain rounded-xl shadow-2xl transition-opacity duration-300"
                    />
                  ) : (
                    <div className="text-center space-y-4 opacity-50">
                      <CheckCircle2 size={40} className="mx-auto text-success" />
                      <p className="text-sm font-semibold text-slate-300 px-8">No watermarks detected in this image.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Table Results if available */}
        {result && result.detections.length > 0 && (
          <div className="mt-8 border-t border-slate-100 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                <BarChart3 size={20} className="text-primary" />
                Detailed Confidence Report
             </div>
             <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Classification</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Confidence</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Extracted Text</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {result.detections.map((det, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary capitalize">
                            {det.class_name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-[120px] overflow-hidden">
                              <div 
                                className="h-full bg-success rounded-full" 
                                style={{ width: `${(det.ensemble_score || det.confidence) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-mono font-bold text-slate-600">
                              {((det.ensemble_score || det.confidence) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
                            {det.ocr_text ? det.ocr_text : <span className="text-slate-400 italic text-xs">Symbol/None</span>}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-[10px] text-slate-400">
                          {Math.round(det.x1)}, {Math.round(det.y1)} → {Math.round(det.x2)}, {Math.round(det.y2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
    </section>
  );
};
