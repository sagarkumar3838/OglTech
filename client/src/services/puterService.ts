// @ts-ignore - puter is loaded via CDN
import puter from 'puter';

declare global {
  interface Window {
    puter: any;
  }
}

export interface EvaluationFile {
  name: string;
  path: string;
  size: number;
  modified: Date;
  type: 'evaluation' | 'scorecard';
}

class PuterService {
  private initialized = false;
  private enabled = false;

  constructor() {
    this.enabled = import.meta.env.VITE_PUTER_ENABLED === 'true';
  }

  async initialize(): Promise<boolean> {
    if (!this.enabled) {
      console.log('Puter.js is disabled');
      return false;
    }

    if (this.initialized) return true;
    
    try {
      // Check if we're in Puter environment
      if (typeof window !== 'undefined' && window.puter) {
        await puter.auth.signIn();
        this.initialized = true;
        console.log('✅ Puter.js initialized successfully');
        
        // Create directories if they don't exist
        await this.ensureDirectories();
        return true;
      } else {
        console.log('Puter.js not available in this environment');
        return false;
      }
    } catch (error) {
      console.error('❌ Puter.js initialization failed:', error);
      return false;
    }
  }

  private async ensureDirectories() {
    try {
      await puter.fs.mkdir('/evaluations');
    } catch (error) {
      // Directory might already exist
    }
    
    try {
      await puter.fs.mkdir('/scorecards');
    } catch (error) {
      // Directory might already exist
    }
  }

  async isAvailable(): Promise<boolean> {
    return await this.initialize();
  }

  // Save evaluation result as JSON file
  async saveEvaluation(evaluationData: any, candidateName: string): Promise<string | null> {
    if (!(await this.initialize())) return null;
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `evaluation-${candidateName}-${timestamp}.json`;
      const content = JSON.stringify(evaluationData, null, 2);
      
      await puter.fs.write(`/evaluations/${filename}`, content);
      console.log(`✅ Evaluation saved: ${filename}`);
      return filename;
    } catch (error) {
      console.error('❌ Failed to save evaluation:', error);
      return null;
    }
  }

  // Save scorecard as JSON file (PDF generation would require additional libraries)
  async saveScorecard(scorecardData: any, candidateName: string): Promise<string | null> {
    if (!(await this.initialize())) return null;
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `scorecard-${candidateName}-${timestamp}.json`;
      const content = JSON.stringify(scorecardData, null, 2);
      
      await puter.fs.write(`/scorecards/${filename}`, content);
      console.log(`✅ Scorecard saved: ${filename}`);
      return filename;
    } catch (error) {
      console.error('❌ Failed to save scorecard:', error);
      return null;
    }
  }

  // List user's evaluation files
  async listEvaluations(): Promise<EvaluationFile[]> {
    if (!(await this.initialize())) return [];
    
    try {
      const evaluationFiles = await puter.fs.readdir('/evaluations');
      const scorecardFiles = await puter.fs.readdir('/scorecards');
      
      const allFiles: EvaluationFile[] = [];
      
      // Process evaluation files
      for (const file of evaluationFiles) {
        if (file.name.endsWith('.json')) {
          allFiles.push({
            name: file.name,
            path: `/evaluations/${file.name}`,
            size: file.size || 0,
            modified: new Date(file.modified || Date.now()),
            type: 'evaluation'
          });
        }
      }
      
      // Process scorecard files
      for (const file of scorecardFiles) {
        if (file.name.endsWith('.json')) {
          allFiles.push({
            name: file.name,
            path: `/scorecards/${file.name}`,
            size: file.size || 0,
            modified: new Date(file.modified || Date.now()),
            type: 'scorecard'
          });
        }
      }
      
      // Sort by modification date (newest first)
      return allFiles.sort((a, b) => b.modified.getTime() - a.modified.getTime());
    } catch (error) {
      console.error('❌ Failed to list files:', error);
      return [];
    }
  }

  // Read a specific file
  async readFile(path: string): Promise<any | null> {
    if (!(await this.initialize())) return null;
    
    try {
      const content = await puter.fs.read(path);
      return JSON.parse(content);
    } catch (error) {
      console.error('❌ Failed to read file:', error);
      return null;
    }
  }

  // Share a file and get public link
  async shareFile(path: string): Promise<string | null> {
    if (!(await this.initialize())) return null;
    
    try {
      const shareLink = await puter.fs.share(path, {
        read: true,
        write: false
      });
      console.log(`✅ File shared: ${shareLink}`);
      return shareLink;
    } catch (error) {
      console.error('❌ Failed to share file:', error);
      return null;
    }
  }

  // Delete a file
  async deleteFile(path: string): Promise<boolean> {
    if (!(await this.initialize())) return false;
    
    try {
      await puter.fs.delete(path);
      console.log(`✅ File deleted: ${path}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete file:', error);
      return false;
    }
  }

  // Show desktop notification (if in Puter environment)
  async showNotification(title: string, message: string, icon?: string): Promise<void> {
    if (!(await this.initialize())) return;
    
    try {
      await puter.ui.showNotification({
        title,
        message,
        icon: icon || '/favicon.ico'
      });
    } catch (error) {
      console.error('❌ Failed to show notification:', error);
      // Fallback to browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body: message, icon });
      }
    }
  }

  // Set window title (if in Puter environment)
  async setWindowTitle(title: string): Promise<void> {
    if (!(await this.initialize())) return;
    
    try {
      await puter.ui.setWindowTitle(title);
    } catch (error) {
      console.error('❌ Failed to set window title:', error);
      // Fallback to document title
      document.title = title;
    }
  }

  // Export data as downloadable file (fallback for non-Puter environments)
  exportAsFile(data: any, filename: string, type: 'json' | 'csv' = 'json'): void {
    let content: string;
    let mimeType: string;
    
    if (type === 'json') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
    } else {
      // Convert to CSV (basic implementation)
      content = this.jsonToCsv(data);
      mimeType = 'text/csv';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  private jsonToCsv(data: any): string {
    if (Array.isArray(data)) {
      if (data.length === 0) return '';
      
      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(',')];
      
      for (const row of data) {
        const values = headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csvRows.push(values.join(','));
      }
      
      return csvRows.join('\n');
    } else {
      // Single object
      const headers = Object.keys(data);
      const values = headers.map(header => {
        const value = data[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      });
      
      return [headers.join(','), values.join(',')].join('\n');
    }
  }
}

export const puterService = new PuterService();