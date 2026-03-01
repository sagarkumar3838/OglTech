# Final Skill Names from Database

Based on the SQL query results, here are the EXACT skill names in your database:

## Skills Found:
1. Angular (capital A)
2. C# (with hash)
3. C++ (with plus plus)
4. Node.js (capital N, lowercase j, with dot)

## Skills to Update in Code:
- Node.js ✅ (already correct)
- C# ✅ (already correct)  
- C++ ✅ (already correct)
- Angular ✅ (already correct)

The `.ilike()` function I added should handle case-insensitive matching, so all skills should work now regardless of exact capitalization.

## Test These Combinations:
1. Angular + Advanced → Should show 10 questions (178 available)
2. Angular + Basic → Should show 10 questions (67 available)
3. Angular + Intermediate → Should show 10 questions (244 available)
4. C# + Advanced → Should show 10 questions (308 available)
5. C# + Basic → Should show 10 questions (111 available)
6. C++ + Intermediate → Should show 10 questions (194 available)
7. Node.js + Advanced → Should show 10 questions (42 available)

All skills should now work with the `.ilike()` case-insensitive search!
