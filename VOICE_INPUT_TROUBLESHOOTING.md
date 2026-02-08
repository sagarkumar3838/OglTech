# 🎤 Voice Input Troubleshooting Guide

## Issue: Microphone Icon Not Showing

If you don't see the microphone icon 🎤 on the evaluation page, follow these steps:

---

## ✅ Quick Fixes

### 1. Clear Browser Cache (Most Common Fix!)
**Chrome/Edge:**
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Select "All time"
4. Click "Clear data"
5. Refresh the page (`Ctrl + F5`)

**Or use Incognito/Private mode:**
1. Press `Ctrl + Shift + N` (Chrome/Edge)
2. Go to https://skillevaluate.web.app
3. Test if microphone appears

### 2. Check Browser Compatibility
The voice input uses **Web Speech API** which is supported in:
- ✅ Chrome (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ⚠️ Firefox (Limited support)
- ❌ Internet Explorer (Not supported)

**Solution:** Use Chrome or Edge for best experience.

### 3. Check HTTPS
Voice input only works on HTTPS (secure) websites.
- ✅ https://skillevaluate.web.app (Secure - should work)
- ❌ http://localhost:5173 (Not secure - won't work)

### 4. Check Microphone Permissions
1. Click the 🔒 lock icon in address bar
2. Check if "Microphone" is allowed
3. If blocked, change to "Allow"
4. Refresh the page

---

## 🔍 Detailed Troubleshooting

### Step 1: Verify Deployment
Check if the latest version is deployed:

```bash
# Check deployment timestamp
curl -I https://skillevaluate.web.app

# Should show recent date in "last-modified" header
```

### Step 2: Check Browser Console
1. Press `F12` to open Developer Tools
2. Go to "Console" tab
3. Look for errors related to:
   - `VoiceInputButton`
   - `useVoiceInput`
   - `SpeechRecognition`
   - `webkitSpeechRecognition`

**Common errors:**

**Error 1: "SpeechRecognition is not defined"**
- **Cause**: Browser doesn't support Web Speech API
- **Solution**: Use Chrome or Edge

**Error 2: "Module not found: VoiceInputButton"**
- **Cause**: Component not built properly
- **Solution**: Rebuild and redeploy (see below)

**Error 3: "Microphone permission denied"**
- **Cause**: User denied microphone access
- **Solution**: Allow microphone in browser settings

### Step 3: Check Network Tab
1. Press `F12` → "Network" tab
2. Refresh page (`Ctrl + F5`)
3. Look for `index-*.js` file
4. Check if it's loading from cache or server
5. If from cache, clear cache and try again

### Step 4: Verify Component Code
Check if VoiceInputButton is being rendered:

1. Press `F12` → "Elements" tab
2. Press `Ctrl + F` to search
3. Search for "microphone" or "voice"
4. If not found, component is not rendering

---

## 🔧 Manual Fix: Rebuild and Redeploy

If the issue persists, rebuild and redeploy:

```bash
# 1. Navigate to client folder
cd client

# 2. Clean build
rm -rf dist
rm -rf node_modules/.vite

# 3. Rebuild
npm run build

# 4. Deploy
cd ..
firebase deploy --only hosting

# 5. Wait 1-2 minutes for CDN to update
# 6. Clear browser cache
# 7. Test again
```

---

## 🧪 Test Voice Input Support

Open browser console (`F12`) and run this code:

```javascript
// Test if Web Speech API is supported
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  console.log("✅ Voice input is supported!");
  console.log("SpeechRecognition:", SpeechRecognition);
} else {
  console.log("❌ Voice input is NOT supported in this browser");
  console.log("Please use Chrome, Edge, or Safari");
}
```

**Expected output:**
```
✅ Voice input is supported!
SpeechRecognition: function SpeechRecognition() { [native code] }
```

---

## 📱 Mobile Testing

### Android (Chrome/Edge)
1. Open https://skillevaluate.web.app
2. Start evaluation
3. Microphone icon should appear
4. Tap microphone
5. Allow microphone permission
6. Speak answer

### iOS (Safari)
1. Open https://skillevaluate.web.app
2. Start evaluation
3. Microphone icon should appear
4. Tap microphone
5. Allow microphone permission
6. Speak answer

**Note:** iOS Safari has some limitations with Web Speech API.

---

## 🎯 Where Should Microphone Appear?

### Fill-in-the-Blank Questions
```
┌─────────────────────────────────────────────┐
│ Question: The HTML ___ attribute...         │
│                                             │
│ 💡 Type your answer or click microphone    │
│                                             │
│ [Text Input Box]  [🎤]  ← Microphone here  │
└─────────────────────────────────────────────┘
```

### MCQ Questions
```
┌─────────────────────────────────────────────┐
│ Question: What is HTML?                     │
│                                             │
│ 💡 Click option or use microphone          │
│                                             │
│              [🎤]  ← Microphone here        │
│                                             │
│  ○  A. Markup Language                      │
│  ○  B. Programming Language                 │
│  ○  C. Database                             │
│  ○  D. Framework                            │
└─────────────────────────────────────────────┘
```

---

## 🐛 Known Issues

### Issue 1: Microphone Not Showing After Deployment
**Cause:** Browser cache showing old version  
**Solution:** Clear cache (`Ctrl + Shift + Delete`) and hard refresh (`Ctrl + F5`)

### Issue 2: Microphone Shows But Doesn't Work
**Cause:** Microphone permission denied  
**Solution:** Click lock icon in address bar → Allow microphone

### Issue 3: "Not Supported" Message
**Cause:** Browser doesn't support Web Speech API  
**Solution:** Use Chrome, Edge, or Safari

### Issue 4: Works on Desktop But Not Mobile
**Cause:** Mobile browser limitations  
**Solution:** Use Chrome on Android or Safari on iOS

---

## ✅ Verification Checklist

Before reporting an issue, verify:

- [ ] Using Chrome, Edge, or Safari (not Firefox or IE)
- [ ] Cleared browser cache (`Ctrl + Shift + Delete`)
- [ ] Hard refreshed page (`Ctrl + F5`)
- [ ] Checked browser console for errors (`F12`)
- [ ] Verified microphone permission is allowed
- [ ] Tested in Incognito/Private mode
- [ ] Checked if Web Speech API is supported (see test above)
- [ ] Waited 2-3 minutes after deployment for CDN update

---

## 🆘 Still Not Working?

### Option 1: Use Different Browser
Try Chrome or Edge (best support for Web Speech API)

### Option 2: Check Component Files
Verify these files exist:
- `client/src/components/VoiceInputButton.tsx`
- `client/src/hooks/useVoiceInput.ts`
- `client/src/pages/Evaluation.tsx` (imports VoiceInputButton)

### Option 3: Rebuild from Scratch
```bash
# Clean everything
cd client
rm -rf dist
rm -rf node_modules/.vite
rm -rf node_modules

# Reinstall
npm install

# Rebuild
npm run build

# Redeploy
cd ..
firebase deploy --only hosting
```

### Option 4: Check Browser Console
1. Press `F12`
2. Go to Console tab
3. Look for errors
4. Share error messages for debugging

---

## 📞 Quick Support

### Check Deployment Status
```bash
# Check if latest version is deployed
curl -I https://skillevaluate.web.app

# Check specific file
curl https://skillevaluate.web.app/assets/index-*.js | grep -i "voice"
```

### Test Voice API Support
Open console and run:
```javascript
console.log("SpeechRecognition:", window.SpeechRecognition || window.webkitSpeechRecognition);
```

### Force Clear Cache
1. Open DevTools (`F12`)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

---

## 🎉 Expected Behavior

When working correctly:

1. **Fill-in-the-blank**: Microphone button appears next to text input
2. **MCQ**: Microphone button appears centered above options
3. **Click microphone**: Button turns red and animates
4. **Speak**: Text appears in input OR option is selected
5. **Stop**: Button returns to blue

---

## 📝 Summary

**Most common fix:** Clear browser cache and hard refresh!

**Quick steps:**
1. Press `Ctrl + Shift + Delete`
2. Clear "Cached images and files"
3. Press `Ctrl + F5` to hard refresh
4. Test again

**If still not working:**
1. Use Chrome or Edge
2. Check browser console for errors
3. Verify microphone permission
4. Try Incognito mode

---

**Last Updated**: January 30, 2026  
**Status**: Voice input deployed and working  
**Deployment**: https://skillevaluate.web.app
