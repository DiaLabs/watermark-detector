'use client';

import { useState } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle, X, ChevronRight, BarChart3 } from 'lucide-react';

interface SubDetection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: number;
  class_id: number;
  class_name: string;
}

interface DetectionResponse {
  original_image: string;
  annotated_image: string | null;
  detection_count: number;
  detections: SubDetection[];
  summary: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
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
  };

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-20">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-sm">WD</span>
              Watermark Detector
            </h1>
            <p className="text-slate-500 font-medium">Professional AI analysis for watermark identification.</p>
          </div>
          {file && (
            <button 
              onClick={reset}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X size={16} />
              Reset Workspace
            </button>
          )}
        </header>

        {/* Workspace Content */}
        <div className="grid gap-12">
          {!file ? (
            /* Minimalist Dropzone */
            <div className="group relative border border-slate-200 bg-white rounded-2xl p-20 text-center hover:border-slate-400 transition-all cursor-pointer shadow-sm">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
                accept="image/*"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors">
                  <UploadCloud size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-slate-900">Select an image to analyze</p>
                  <p className="text-sm text-slate-400 font-medium">Drag and drop or click to browse</p>
                </div>
              </div>
            </div>
          ) : (
            /* Active Workspace */
            <div className="space-y-10">
              
              {/* Toolbar */}
              {!result && (
                <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 px-2">
                    <ImageIcon size={18} className="text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">{file.name}</span>
                    <span className="text-xs text-slate-400 font-medium">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <button 
                    onClick={handleUpload}
                    disabled={loading}
                    className="bg-slate-900 text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Image
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 text-red-800">
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Comparison Grid */}
              <div className={`grid gap-6 ${result ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
                {/* Original Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Input Source</h3>
                    {!result && <span className="text-xs font-medium text-slate-400">Ready for processing</span>}
                  </div>
                  <div className="aspect-square bg-white border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center p-2 shadow-sm">
                    <img 
                      src={preview!} 
                      alt="Original" 
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                </div>

                {/* Detection Output */}
                {result && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Analysis Result</h3>
                      <span className={`text-xs font-bold ${result.detection_count > 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
                        {result.detection_count} {result.detection_count === 1 ? 'Watermark' : 'Watermarks'} Found
                      </span>
                    </div>
                    <div className="aspect-square bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center p-2 shadow-inner shadow-black/20">
                      {result.annotated_image ? (
                        <img 
                          src={result.annotated_image} 
                          alt="Annotated" 
                          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                      ) : (
                        <div className="text-center space-y-4">
                          <CheckCircle2 size={40} className="mx-auto text-emerald-500" />
                          <p className="text-sm font-semibold text-slate-400 px-8">No watermarks detected in this image.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Results Summary & Table */}
              {result && (
                <div className="grid lg:grid-cols-3 gap-8 pt-8 border-t border-slate-200">
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <BarChart3 size={18} />
                        Summary
                      </div>
                      <div className="space-y-2">
                        <p className="text-2xl font-bold tracking-tight text-slate-900">{result.summary}</p>
                        <p className="text-sm font-medium text-slate-500">Scan completed successfully</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    {result.detections.length > 0 ? (
                      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Classification</th>
                              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Confidence</th>
                              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Position</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {result.detections.map((det, index) => (
                              <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 capitalize">
                                    {det.class_name}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[100px] overflow-hidden">
                                      <div 
                                        className="h-full bg-slate-900 rounded-full" 
                                        style={{ width: `${det.confidence * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-mono font-bold text-slate-600">
                                      {(det.confidence * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-[10px] text-slate-400">
                                  {Math.round(det.x1)}, {Math.round(det.y1)} → {Math.round(det.x2)}, {Math.round(det.y2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-2xl">
                        <p className="text-slate-400 font-medium italic text-center">No detection data available for this session.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="pt-12 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Powered by Advanced Computer Vision</p>
        </footer>
      </div>
    </main>
  );
}
