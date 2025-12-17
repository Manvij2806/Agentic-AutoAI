import { useState, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Eye, 
  Download,
  File,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp, Document } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(type: string) {
  if (type.includes('pdf')) return FileText;
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) return FileSpreadsheet;
  return File;
}

export default function Documents() {
  const { documents, setDocuments } = useApp();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress((prev) => ({ ...prev, [id]: i }));
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Simulate metric extraction
    const metrics: Document['metrics'] = {};
    if (file.name.toLowerCase().includes('earnings') || file.name.toLowerCase().includes('financial')) {
      metrics.revenue = 2400000000 + Math.random() * 100000000;
      metrics.earnings = 672000000 + Math.random() * 50000000;
      metrics.growth = 10 + Math.random() * 5;
    }
    if (file.name.toLowerCase().includes('esg')) {
      metrics.esgScore = 80 + Math.random() * 15;
    }

    const newDoc: Document = {
      id,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date(),
      metrics: Object.keys(metrics).length > 0 ? metrics : undefined,
    };

    setDocuments((prev) => [...prev, newDoc]);
    setUploadProgress((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });

    toast({
      title: 'Document uploaded',
      description: `${file.name} has been processed successfully.`,
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach(processFile);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(processFile);
    }
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    toast({
      title: 'Document deleted',
      description: 'The document has been removed.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Document Management</h1>
        <p className="text-muted-foreground">
          Upload and manage financial documents for AI-powered analysis and report generation.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 mb-8",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        )}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept=".pdf,.xlsx,.xls,.csv"
          onChange={handleFileSelect}
        />
        
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 shadow-glow-sm">
          <Upload className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Drop files here or click to upload</h3>
        <p className="text-muted-foreground mb-6">
          Supports PDF, XLSX, and CSV files up to 50MB
        </p>
        
        <label htmlFor="file-upload">
          <Button variant="gradient" className="cursor-pointer">
            Select Files
          </Button>
        </label>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mb-8 space-y-3">
          {Object.entries(uploadProgress).map(([id, progress]) => (
            <div key={id} className="bg-card rounded-xl p-4 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full gradient-bg transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Uploaded Documents ({documents.length})</h2>
        
        {documents.length === 0 ? (
          <div className="bg-card rounded-xl p-12 text-center border border-border/50">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc, index) => {
              const FileIcon = getFileIcon(doc.type);
              return (
                <div
                  key={doc.id}
                  className="bg-card rounded-xl p-6 border border-border/50 card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileIcon className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{doc.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{formatFileSize(doc.size)}</span>
                        <span>•</span>
                        <span>{doc.uploadedAt.toLocaleDateString()}</span>
                      </div>
                      
                      {doc.metrics && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {doc.metrics.revenue && (
                            <span className="metric-badge metric-badge-success">
                              <CheckCircle className="w-3 h-3" />
                              Revenue: ${(doc.metrics.revenue / 1e9).toFixed(2)}B
                            </span>
                          )}
                          {doc.metrics.growth && (
                            <span className="metric-badge metric-badge-success">
                              <CheckCircle className="w-3 h-3" />
                              Growth: {doc.metrics.growth.toFixed(1)}%
                            </span>
                          )}
                          {doc.metrics.esgScore && (
                            <span className="metric-badge metric-badge-success">
                              <CheckCircle className="w-3 h-3" />
                              ESG: {doc.metrics.esgScore.toFixed(0)}/100
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
