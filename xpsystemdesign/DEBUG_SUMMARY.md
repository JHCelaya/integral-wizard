# Practice Screen Debug Summary

## Issues Identified

### 1. Console Error: `difficulty.toLowerCase is not a function`
**Root Cause**: The `ProgressTracker.ts` was calling `XPCalculator.calculateProblemXP()` with the old signature (passing the entire Problem object), but the function was updated to accept individual parameters.

**Fix Applied**: Updated `ProgressTracker.ts` line 12 to call `XPCalculator.calculateProblemXP()` with the correct parameters:
```typescript
const xpEarned = XPCalculator.calculateProblemXP(
    problem.difficulty,  // Now passing difficulty string
    isCorrect, 
    1,  // numAttempts (default 1 for legacy)
    hintsUsed
);
```

### 2. Math Problems Not Displaying
**Potential Causes**:
- MathRenderer WebView might not be loading
- LaTeX syntax issues
- Layout/sizing problems

**Debug Changes Applied**:
1. Added debug text output showing:
   - Raw LaTeX string
   - Solution LaTeX
2. Added visual debugging to MathRenderer (grey background, border)
3. Added console.log to show generated problems in full
4. Added `userAnswer` state for future answer input implementation

## Files Modified

1. **`src/services/ProgressTracker.ts`** - Fixed XPCalculator call signature
2. **`app/(tabs)/practice.tsx`** - Added debug output and userAnswer state
3. **`src/components/MathRenderer.tsx`** - Added visual debugging styles

## Next Steps for Testing

1. **Restart the Expo server** if it's not running
2. **Navigate to Practice tab**
3. **Select "Substitution" skill, "Easy" difficulty, "Small" size**
4. **Click "Start Practice"**
5. **Check console logs** for "Generated Problems:" output
6. **Look for**:
   - Grey box where math should render (MathRenderer container)
   - Debug text showing LaTeX and Solution below the math
   - Problem counter and timer working

## Expected Behavior

- You should see the LaTeX string displayed as text
- The MathRenderer should show a grey box (even if math doesn't render)
- Console should show the full problem data structure
- Clicking Yes/No should no longer cause errors

## Future Improvements Needed

1. **Answer Input**: Replace Yes/No buttons with a text input for actual answer checking
2. **Answer Validation**: Implement logic to compare user answer with solution
3. **MathRenderer**: If WebView doesn't work, consider using react-native-math-view or similar
