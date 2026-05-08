'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

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
  
  const API_URL = 'http://localhost:8000';

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
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            Watermark Detector
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload an image to instantly identify and locate watermarks using AI.
          </p>
        </header>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          <div className="p-8 md:p-12">
            {!file ? (
              // Upload Zone
              <div className="border-3 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 cursor-pointer relative group">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                  accept="image/jpeg, image/png, image/bmp, image/gif, image/tiff"
                />
                <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
                  <div className="p-4 bg-blue-50 rounded-full text-blue-600 group-hover:scale-110 transition-transform duration-200">
                    <UploadCloud size={48} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-semibold text-gray-700">Click or drag image to upload</p>
                    <p className="text-sm text-gray-500">Supports JPG, PNG, BMP, GIF, TIFF up to 10MB</p>
                  </div>
                </div>
              </div>
            ) : (
              // Preview & Results View
              <div className="space-y-8">
                
                {/* Actions */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <ImageIcon size={20} />
                    <span className="font-medium truncate max-w-xs">{file.name}</span>
                    <span className="text-gray-400 text-sm">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <div className="flex space-x-4">
                    <button 
                      onClick={reset}
                      className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      disabled={loading}
                    >
                      Clear
                    </button>
                    {!result && (
                      <button 
                        onClick={handleUpload}
                        disabled={loading}
                        className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-all shadow-sm flex items-center space-x-2
                          ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}`}
                      >
                        {loading && (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        <span>{loading ? 'Analyzing Image...' : 'Detect Watermarks'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 text-red-700">
                    <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-semibold">Detection failed</h4>
                      <p className="text-sm mt-1 opacity-90">{error}</p>
                    </div>
                  </div>
                )}

                {/* Main Content: Images side-by-side or stacked depending on state */}
                <div className={`grid gap-8 ${result ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                   
                   {/* Original Image Panel */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                       <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                       <span>Original Upload</span>
                     </h3>
                     <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center min-h-[400px]">
                        {/* We use standard img for dynamic external blobs comfortably */}
                       <img 
                          src={preview!} 
                          alt="Original preview" 
                          className="max-h-[600px] w-auto object-contain mx-auto"
                        />
                     </div>
                   </div>

                   {/* Result Image Panel */}
                   {result && (
                     <div className="space-y-4">
                       <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                         <div className="w-2 h-2 rounded-full bg-green-500"></div>
                         <span>Detection Output</span>
                       </h3>
                       <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center min-h-[400px]">
                          {result.annotated_image ? (
                            <img 
                              src={`${API_URL}${result.annotated_image}`} 
                              alt="Annotated detection result" 
                              className="max-h-[600px] w-auto object-contain mx-auto"
                            />
                          ) : (
                            <div className="text-center text-gray-400 p-8">
                              <CheckCircle2 size={48} className="mx-auto mb-4 text-green-300" />
                              <p className="text-lg font-medium text-gray-600">No image annotations available.</p>
                            </div>
                          )}
                       </div>
                     </div>
                   )}
                </div>

                {/* Metadata & Summary */}
                {result && (
                  <div className="mt-8 bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className={`p-2 rounded-full ${result.detection_count > 0 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        {result.detection_count > 0 ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{result.summary}</h3>
                        <p className="text-gray-600 text-sm">Processed successfully</p>
                      </div>
                    </div>

                    {result.detections.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-white/60 text-gray-600 font-semibold border-b border-blue-100">
                            <tr>
                              <th className="px-4 py-3 rounded-tl-lg">Detection Type</th>
                              <th className="px-4 py-3">Confidence</th>
                              <th className="px-4 py-3 rounded-tr-lg">Bounding Box (x1, y1, x2, y2)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-blue-50">
                            {result.detections.map((det, index) => (
                              <tr key={index} className="hover:bg-white/40 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900 capitalize">{det.class_name}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-blue-500" 
                                        style={{ width: `${det.confidence * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-gray-600 font-mono">{(det.confidence * 100).toFixed(1)}%</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                                  [{Math.round(det.x1)}, {Math.round(det.y1)}, {Math.round(det.x2)}, {Math.round(det.y2)}]
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
