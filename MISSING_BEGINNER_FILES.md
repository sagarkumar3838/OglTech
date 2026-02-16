# Missing Beginner Questions - Need to Upload

Based on your Supabase table, these beginner-level CSV files are **NOT uploaded yet**:

## ❌ MISSING (Need to Upload):

1. **angular-beginner.csv** ❌
2. **ansible-beginner.csv** ❌
3. **aws-beginner.csv** ❌
4. **azure-beginner.csv** ❌
5. **cpp-beginner.csv** ❌
6. **csharp-beginner.csv** ❌
7. **css-beginner.csv** ❌ (You tested this!)
8. **cypress-beginner.csv** ❌
9. **devtools-beginner.csv** ❌
10. **docker-beginner.csv** ❌
11. **flutter-beginner.csv** ❌
12. **gcp-beginner.csv** ❌
13. **git-beginner.csv** ❌
14. **glsl-beginner.csv** ❌
15. **go-beginner.csv** ❌
16. **jest-beginner.csv** ❌
17. **kotlin-beginner.csv** ❌
18. **kubernetes-beginner.csv** ❌
19. **linux-beginner.csv** ❌
20. **mongodb-beginner.csv** ❌
21. **nodejs-beginner.csv** ❌
22. **oracle-beginner.csv** ❌
23. **php-beginner.csv** ❌
24. **postgresql-beginner.csv** ❌
25. **python-beginner.csv** ❌ **← THIS IS WHY PYTHON BEGINNER DOESN'T WORK!**
26. **redis-beginner.csv** ❌
27. **ruby-beginner.csv** ❌
28. **rust-beginner.csv** ❌
29. **selenium-beginner.csv** ❌
30. **sql-beginner.csv** ❌
31. **swift-beginner.csv** ❌
32. **terraform-beginner.csv** ❌
33. **typescript-beginner.csv** ❌
34. **unity-beginner.csv** ❌
35. **unreal-beginner.csv** ❌

## ✅ ALREADY IN DATABASE:

1. **html-beginner.csv** ✅ (shows as "html Basic" in database)
2. **java-beginner.csv** ✅ (shows as "java Basic")
3. **javascript-beginner.csv** ✅ (shows as "javascript Basic")
4. **opengl-beginner.csv** ✅ (shows as "opengl Basic")
5. **react-beginner.csv** ✅ (shows as "react Basic")
6. **reactnative-beginner.csv** ✅ (shows as "reactnative Basic")

## How to Upload:

### Option 1: Use Supabase Table Editor (Easiest)
1. Go to Supabase Dashboard → Table Editor
2. Select `practice_questions` table
3. Click "Insert" → "Import data from CSV"
4. Upload each missing CSV file one by one
5. Map columns correctly
6. Click "Import"

### Option 2: Use Upload Script
```bash
cd scripts
npm install
node upload-all-questions.ts
```

### Option 3: Upload Just Python Beginner (Quick Fix)
1. Go to Supabase → practice_questions table
2. Click "Insert" → "Import CSV"
3. Select `questions/python-beginner.csv`
4. Import it
5. Then run `CHECK_AND_FIX_QUESTIONS.sql`

## After Upload:
Run `CHECK_AND_FIX_QUESTIONS.sql` to copy from `practice_questions` to `questions` table with correct level mapping (Basic → easy).
