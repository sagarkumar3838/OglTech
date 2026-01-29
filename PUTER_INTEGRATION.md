# Puter.js Integration Guide

## What is Puter.js?

Puter.js is a cloud operating system that provides:
- ✅ Cloud file storage
- ✅ Desktop-like interface
- ✅ App hosting
- ✅ User authentication
- ✅ File management APIs

## How Puter.js Can Enhance This App

### 1. File Storage for Evaluations
- Store evaluation results as files
- Export scorecards as PDF/JSON
- Save user progress
- Backup question banks

### 2. Desktop-like Interface
- Run the app as a Puter desktop application
- Multiple windows for different evaluations
- File manager for results
- System notifications

### 3. User Data Management
- Store user profiles in Puter cloud
- Sync evaluation history across devices
- Share scorecards with others
- Collaborative features

## Integration Options

### Option 1: Add Puter.js to Existing App (Recommended)

Add Puter.js as an additional storage and UI layer while keeping Firebase for real-time features.

### Option 2: Full Puter.js Migration

Move the entire app to run on Puter's cloud OS platform.

### Option 3: Hybrid Approach

Use Puter.js for file storage and desktop features, Firebase for authentication and real-time data.

## Implementation Guide

### Step 1: Install Puter.js SDK

```bash
cd client
npm install puter
```

### Step 2: Add Puter Configuration

Add to your `.env`:
```env
# Puter.js Configuration
VITE_PUTER_APP_NAME=skill-evaluation-platform
VITE_PUTER_DOMAIN=puter.com
VITE_PUTER_ENABLED=true
```

### Step 3: Create Puter Service

Create `client/src/services/puterService.ts`:
```typescript
import puter from 'puter';

class PuterService {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    try {
      await puter.auth.signIn();
      this.initialized = true;
      console.log('✅ Puter.js initialized');
    } catch (error) {
      console.error('❌ Puter.js initialization failed:', error);
    }
  }

  // Save evaluation result as file
  async saveEvaluation(evaluationData: any, filename: string) {
    await this.initialize();
    
    const content = JSON.stringify(evaluationData, null, 2);
    await puter.fs.write(`/evaluations/${filename}.json`, content);
  }

  // Save scorecard as PDF
  async saveScorecard(scorecardData: any, filename: string) {
    await this.initialize();
    
    // Convert scorecard to PDF (you'd implement this)
    const pdfContent = await this.generatePDF(scorecardData);
    await puter.fs.write(`/scorecards/${filename}.pdf`, pdfContent);
  }

  // List user's evaluations
  async listEvaluations() {
    await this.initialize();
    
    try {
      const files = await puter.fs.readdir('/evaluations');
      return files.filter(file => file.name.endsWith('.json'));
    } catch (error) {
      // Directory doesn't exist yet
      return [];
    }
  }

  // Share scorecard with others
  async shareScorecard(filename: string) {
    await this.initialize();
    
    const shareLink = await puter.fs.share(`/scorecards/${filename}.pdf`);
    return shareLink;
  }

  private async generatePDF(data: any): Promise<Blob> {
    // Implement PDF generation (using jsPDF or similar)
    // This is a placeholder
    return new Blob([JSON.stringify(data)], { type: 'application/pdf' });
  }
}

export const puterService = new PuterService();
```

### Step 4: Update Scorecard Component

Modify `client/src/pages/Scorecard.tsx`:
```typescript
import { puterService } from '../services/puterService';

const Scorecard = () => {
  // ... existing code ...

  const handleSaveToCloud = async () => {
    try {
      const filename = `scorecard-${scorecard.candidate_name}-${Date.now()}`;
      await puterService.saveScorecard(scorecard, filename);
      alert('✅ Scorecard saved to Puter cloud!');
    } catch (error) {
      console.error('Error saving to Puter:', error);
      alert('❌ Failed to save to cloud');
    }
  };

  const handleShare = async () => {
    try {
      const filename = `scorecard-${scorecard.candidate_name}-${Date.now()}`;
      await puterService.saveScorecard(scorecard, filename);
      const shareLink = await puterService.shareScorecard(filename);
      
      navigator.clipboard.writeText(shareLink);
      alert('✅ Share link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing:', error);
      alert('❌ Failed to create share link');
    }
  };

  return (
    <div className="scorecard">
      {/* ... existing scorecard content ... */}
      
      <div className="flex space-x-4 mt-6">
        <button
          onClick={() => window.print()}
          className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600"
        >
          <Download className="w-5 h-5" />
          <span>Download PDF</span>
        </button>
        
        <button
          onClick={handleSaveToCloud}
          className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <Cloud className="w-5 h-5" />
          <span>Save to Cloud</span>
        </button>
        
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          <Share className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};
```

### Step 5: Add File Manager Component

Create `client/src/components/FileManager.tsx`:
```typescript
import { useState, useEffect } from 'react';
import { puterService } from '../services/puterService';
import { Folder, File, Download, Share } from 'lucide-react';

const FileManager = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const files = await puterService.listEvaluations();
      setEvaluations(files);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">My Evaluations</h2>
      
      {loading ? (
        <div className="text-center py-8">Loading files...</div>
      ) : evaluations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No evaluations saved yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {evaluations.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <File className="w-5 h-5 text-blue-500" />
                <span>{file.name}</span>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-blue-500">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-purple-500">
                  <Share className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileManager;
```

### Step 6: Add to Navigation

Update `client/src/components/Layout.tsx`:
```typescript
// Add to navigation links
<Link to="/files" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100">
  <Folder className="w-4 h-4" />
  <span>My Files</span>
</Link>
```

Add route in `client/src/App.tsx`:
```typescript
<Route path="files" element={<FileManager />} />
```

## Advanced Puter.js Features

### 1. Desktop App Mode

Run as a Puter desktop application:
```typescript
// In main.tsx
import puter from 'puter';

if (window.location.hostname.includes('puter.com')) {
  // Running in Puter environment
  puter.ui.setWindowTitle('Skill Evaluation Platform');
  puter.ui.setWindowIcon('/favicon.ico');
}
```

### 2. Notifications

Add system notifications:
```typescript
// After evaluation completion
await puter.ui.showNotification({
  title: 'Evaluation Complete!',
  message: `You scored ${score}% on ${skill} evaluation`,
  icon: '/favicon.ico'
});
```

### 3. Multi-Window Support

Open scorecards in separate windows:
```typescript
const openScorecardWindow = async (scorecardId: string) => {
  await puter.ui.openWindow({
    url: `/scorecard/${scorecardId}`,
    title: 'Scorecard Results',
    width: 800,
    height: 600
  });
};
```

## Updated Package.json

Add Puter.js dependencies:
```json
{
  "dependencies": {
    "puter": "^2.0.0",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1"
  }
}
```

## Environment Configuration

Update your `.env`:
```env
# Existing configuration...

# Puter.js Integration
VITE_PUTER_ENABLED=true
VITE_PUTER_APP_NAME=skill-evaluation-platform
VITE_PUTER_DOMAIN=puter.com

# Feature Flags
VITE_ENABLE_CLOUD_STORAGE=true
VITE_ENABLE_FILE_SHARING=true
VITE_ENABLE_DESKTOP_MODE=true
```

## Benefits of Puter.js Integration

### For Users
- ✅ **Cloud Storage**: Never lose evaluation results
- ✅ **File Sharing**: Share scorecards easily
- ✅ **Desktop Experience**: Familiar interface
- ✅ **Cross-Device Sync**: Access from anywhere
- ✅ **Offline Support**: Work without internet

### For Developers
- ✅ **Easy Integration**: Simple APIs
- ✅ **Free Hosting**: Deploy on Puter cloud
- ✅ **Built-in Auth**: User management included
- ✅ **File System**: Cloud storage APIs
- ✅ **Desktop APIs**: Native-like features

## Deployment Options

### Option 1: Hybrid (Recommended)
- Keep Firebase for real-time features
- Add Puter.js for file storage and desktop features
- Best of both worlds

### Option 2: Full Puter Migration
- Move entire app to Puter platform
- Use Puter's built-in database
- Simpler architecture

### Option 3: Puter as Add-on
- Keep existing Firebase setup
- Add Puter.js as optional cloud storage
- Users can choose to enable it

## Implementation Steps

1. **Install Puter.js SDK**
   ```bash
   cd client && npm install puter
   ```

2. **Add Puter Service**
   - Create `puterService.ts`
   - Initialize Puter.js

3. **Update Components**
   - Add cloud save buttons
   - Add file manager
   - Add sharing features

4. **Test Integration**
   - Test file operations
   - Test sharing features
   - Test desktop mode

5. **Deploy**
   - Deploy to Puter cloud (optional)
   - Or keep existing Firebase deployment

## Cost Comparison

| Feature | Firebase | Puter.js | Combined |
|---------|----------|----------|----------|
| **Authentication** | Free tier | Free | Free |
| **Database** | Free tier | Free | Free |
| **File Storage** | Paid | Free | Free (Puter) |
| **Hosting** | Free | Free | Free |
| **Desktop Features** | ❌ | ✅ | ✅ |

## Conclusion

Puter.js integration would add powerful cloud storage and desktop features to your skill evaluation platform:

- **Enhanced UX**: Desktop-like interface
- **Cloud Storage**: Save and share evaluations
- **Cross-Platform**: Works everywhere
- **Cost Effective**: Free file storage
- **Easy Integration**: Simple APIs

**Ready to add Puter.js? Start with the hybrid approach for best results! 🚀**