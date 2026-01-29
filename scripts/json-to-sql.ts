import * as fs from 'fs';

interface Question {
  type: string;
  question: string;
  options?: string[];
  correct_answer: any;
  explanation?: string;
  code_snippet?: string;
  test_cases?: any[];
}

interface QuestionBank {
  [skill: string]: {
    [level: string]: Question[];
  };
}

/**
 * Convert JSON questions to SQL INSERT statements
 * 
 * Usage:
 * npx tsx scripts/json-to-sql.ts path/to/questions.json > output.sql
 */
function jsonToSQL(jsonFilePath: string): string {
  console.error(`Reading file: ${jsonFilePath}\n`);

  const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
  const questionBank: QuestionBank = JSON.parse(fileContent);

  let sql = `-- ============================================
-- Auto-generated SQL from JSON
-- Generated at: ${new Date().toISOString()}
-- ============================================

`;

  let totalQuestions = 0;

  for (const [skill, levels] of Object.entries(questionBank)) {
    sql += `\n-- ${skill} Questions\n`;

    for (const [level, questions] of Object.entries(levels)) {
      sql += `-- Level: ${level} (${questions.length} questions)\n`;

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const questionId = `${skill.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase()}-${Date.now()}-${i}`;

        // Escape single quotes in strings
        const escapeSQL = (str: string) => str.replace(/'/g, "''");

        sql += `INSERT INTO questions (question_id, skill, level, type, question, options, correct_answer, explanation, verified) VALUES\n`;
        sql += `('${questionId}', `;
        sql += `'${escapeSQL(skill)}', `;
        sql += `'${level}', `;
        sql += `'${q.type}', `;
        sql += `'${escapeSQL(q.question)}', `;
        sql += `'${JSON.stringify(q.options || [])}'::jsonb, `;
        sql += `'${JSON.stringify(q.correct_answer)}'::jsonb, `;
        sql += `'${escapeSQL(q.explanation || '')}', `;
        sql += `true);\n\n`;

        totalQuestions++;
      }
    }
  }

  sql += `-- Success message\n`;
  sql += `SELECT 'Successfully inserted ${totalQuestions} questions!' as message;\n`;

  console.error(`✅ Generated SQL for ${totalQuestions} questions\n`);

  return sql;
}

// Get file path from command line argument
const jsonFilePath = process.argv[2];

if (!jsonFilePath) {
  console.error('❌ Please provide a JSON file path');
  console.error('\nUsage:');
  console.error('  npx tsx scripts/json-to-sql.ts path/to/questions.json > output.sql');
  console.error('\nExample:');
  console.error('  npx tsx scripts/json-to-sql.ts ./my-questions.json > my-questions.sql');
  process.exit(1);
}

if (!fs.existsSync(jsonFilePath)) {
  console.error(`❌ File not found: ${jsonFilePath}`);
  process.exit(1);
}

// Generate SQL and output to stdout
const sql = jsonToSQL(jsonFilePath);
console.log(sql);
