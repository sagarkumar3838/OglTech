# Tab Switch Detection - Restart on First Switch

## Overview
The evaluation system now **restarts the test with different questions** if the user switches tabs or minimizes the browser **even once**.

## Changes Made

### 1. Updated Hook: `useTabSwitchDetection.ts`
- Added new option: `restartOnFirstSwitch` (boolean)
- Added new return value: `shouldRestartTest` (boolean)
- When `restartOnFirstSwitch` is enabled and user switches tabs once, `shouldRestartTest` becomes `true`

### 2. Updated Page: `Evaluation.tsx`
- Changed `maxSwitches` from `3` to `1`
- Enabled `restartOnFirstSwitch: true`
- Added new `useEffect` hook that:
  - Detects when `shouldRestartTest` is true
  - Shows alert to user
  - Resets all answers and progress
  - Loads new questions from database
- Updated all warning messages to reflect the stricter policy

## User Experience

### Before Tab Switch:
- User sees clear warnings in the instructions popup
- Red warning banner at bottom of page
- Instructions emphasize: "Do NOT switch tabs even ONCE"

### When User Switches Tabs:
1. System detects tab switch immediately
2. Alert appears: "⚠️ Tab switch detected! The test will restart with different questions."
3. All answers are cleared
4. Question index resets to 0
5. New set of questions is loaded from database
6. Timer continues (no reset)

### Visual Warnings:
- **Instructions Popup** (before test starts):
  - Red highlighted warning about restart on first switch
  - Clear explanation of consequences
  
- **Warning Banner** (during test):
  - Red banner appears when tab switch detected
  - Message: "Test will restart with different questions!"
  
- **Bottom Instructions** (always visible):
  - Red border and background
  - Bold text emphasizing the restart policy

## Technical Details

### Hook Configuration:
```typescript
useTabSwitchDetection({
  onTabSwitch: () => {
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 5000);
  },
  maxSwitches: 1,
  resetOnSwitch: true,
  restartOnFirstSwitch: true
})
```

### Restart Logic:
```typescript
useEffect(() => {
  if (shouldRestartTest && !loading) {
    alert('⚠️ Tab switch detected! The test will restart with different questions.');
    setCurrentQuestionIndex(0);
    setAnswers({});
    loadQuestions(); // Fetches new random questions
  }
}, [shouldRestartTest, loading]);
```

## Benefits

1. **Prevents Cheating**: Users cannot switch tabs to search for answers
2. **Different Questions**: Each restart loads new questions, preventing memorization
3. **Clear Communication**: Multiple warnings ensure users understand the policy
4. **Immediate Enforcement**: No warnings or second chances - restart happens immediately
5. **Fair Testing**: Ensures all users complete the test under the same conditions

## Testing Recommendations

1. Start an evaluation
2. Switch to another tab
3. Verify alert appears
4. Verify questions are different
5. Verify answers are cleared
6. Verify timer continues

## Notes

- The timer does NOT reset when test restarts (intentional to prevent time gaming)
- Questions are fetched fresh from database on each restart
- All user progress (answers) is lost on restart
- The system uses `document.visibilitychange` API for reliable detection
