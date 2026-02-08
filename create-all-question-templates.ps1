# Create all 135 CSV template files for questions
# Each file will have header row only, ready for 100 questions

$header = "skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu"

$languages = @(
    # Web Development (7)
    "html", "css", "javascript", "typescript", "react", "angular", "vue",
    
    # Backend (8)
    "java", "python", "nodejs", "csharp", "php", "ruby", "go", "rust",
    
    # Database (5)
    "sql", "oracle", "postgresql", "mongodb", "redis",
    
    # Mobile (4)
    "kotlin", "swift", "flutter", "reactnative",
    
    # DevOps (3)
    "docker", "kubernetes", "linux",
    
    # Cloud (3)
    "aws", "azure", "gcp",
    
    # DevOps Tools (2)
    "terraform", "ansible",
    
    # Graphics (3)
    "opengl", "glsl", "cpp",
    
    # Game Dev (2)
    "unity", "unreal",
    
    # DevTools (4)
    "devtools", "webpack", "git", "vscode",
    
    # Testing (3)
    "selenium", "jest", "cypress"
)

$levels = @("beginner", "intermediate", "advanced")

$count = 0
foreach ($lang in $languages) {
    foreach ($level in $levels) {
        $filename = "questions/$lang-$level.csv"
        $header | Out-File -FilePath $filename -Encoding UTF8
        $count++
        Write-Host "Created: $filename"
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "✅ Created $count CSV template files!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nEach file has header row and is ready for 100 questions."
Write-Host "Total capacity: $($count * 100) questions"
Write-Host "`nFiles are in: questions/ folder"
