import React, { useState, useEffect } from 'react';
import { puterService, EvaluationFile } from '../services/puterService';
import { Folder, File, Download, Share, Trash2, Eye, Cloud, CloudOff } from 'lucide-react';

const PuterFileManager: React.FC = () => {
  const [files, setFiles] = useState<EvaluationFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [puterAvailable, setPuterAvailable] = useState(false);
  const [selectedFile, setSelectedFile] = useState<EvaluationFile | null>(null);

  useEffect(() => {
    checkPuterAndLoadFiles();
  }, []);

  const checkPuterAndLoadFiles = async () => {
    setLoading(true);
    
    const available = await puterService.isAvailable();
    setPuterAvailable(available);
    
    if (available) {
      await loadFiles();
    }
    
    setLoading(false);
  };

  const loadFiles = async () => {
    try {
      const fileList = await puterService.listEvaluations();
      setFiles(fileList);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const handleViewFile = async (file: EvaluationFile) => {
    try {
      const content = await puterService.readFile(file.path);
      setSelectedFile({ ...file, content } as EvaluationFile);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Failed to read file');
    }
  };

  const handleShareFile = async (file: EvaluationFile) => {
    try {
      const shareLink = await puterService.shareFile(file.path);
      if (shareLink) {
        await navigator.clipboard.writeText(shareLink);
        await puterService.showNotification(
          'File Shared',
          'Share link copied to clipboard!'
        );
      }
    } catch (error) {
      console.error('Error sharing file:', error);
      alert('Failed to share file');
    }
  };

  const handleDeleteFile = async (file: EvaluationFile) => {
    if (!confirm(`Are you sure you want to delete ${file.name}?`)) {
      return;
    }

    try {
      const success = await puterService.deleteFile(file.path);
      if (success) {
        await loadFiles(); // Refresh list
        await puterService.showNotification(
          'File Deleted',
          `${file.name} has been deleted`
        );
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

  const handleDownloadFile = (file: EvaluationFile) => {
    if ((file as any).content) {
      puterService.exportAsFile((file as any).content, file.name.replace('.json', ''), 'json');
    } else {
      alert('File content not loaded. Please view the file first.');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Checking Puter.js availability...</span>
        </div>
      </div>
    );
  }

  if (!puterAvailable) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <CloudOff className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Puter.js Not Available</h3>
          <p className="text-gray-500 mb-4">
            Cloud storage features are not available in this environment.
          </p>
          <p className="text-sm text-gray-400">
            To enable cloud storage, run this app in a Puter.js environment or enable Puter.js integration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Cloud className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Cloud Storage</h2>
          </div>
          <button
            onClick={loadFiles}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Files Yet</h3>
            <p className="text-gray-500">
              Complete some evaluations to see your saved files here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {file.type === 'evaluation' ? (
                      <File className="w-8 h-8 text-blue-500" />
                    ) : (
                      <File className="w-8 h-8 text-green-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{file.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="capitalize">{file.type}</span>
                      <span>{formatFileSize(file.size)}</span>
                      <span>{formatDate(file.modified)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewFile(file)}
                    className="p-2 text-gray-500 hover:text-blue-500 transition"
                    title="View File"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadFile(file)}
                    className="p-2 text-gray-500 hover:text-green-500 transition"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShareFile(file)}
                    className="p-2 text-gray-500 hover:text-purple-500 transition"
                    title="Share File"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file)}
                    className="p-2 text-gray-500 hover:text-red-500 transition"
                    title="Delete File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Viewer Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{selectedFile.name}</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[60vh]">
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify((selectedFile as any).content, null, 2)}
              </pre>
            </div>
            <div className="flex justify-end space-x-2 p-4 border-t">
              <button
                onClick={() => handleDownloadFile(selectedFile)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Download
              </button>
              <button
                onClick={() => handleShareFile(selectedFile)}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Share
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PuterFileManager;