import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as Papa from 'papaparse';

const supabaseUrl = 'https://ksjgsgebjnpwyycnptom.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzamdzZ2Viam5wd3l5Y25wdG9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTAzMzk0MSwiZXhwIjoyMDg0NjA5OTQxfQ.9Y2JuAmAXSU7vXZB-UaLQkCw5iddITkJcVTRi6bTfd0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CSVRow {
  skill: string;
  level: string;
  type: string;
  question: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_answer: string;
  explanation: string;
}

async function fixQuestionsDatabase() {
  console.log('🔧 FIXING QUESTIONS DATABASE\n');
  console.log('='.repeat(60));

  try {
    // STEP 1: Check current state
    console.log('\n📊 STEP 1: Checking current database state...\n');
    
    const { count: totalBefore } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   Total questions before: ${totalBefore || 0}`);

    // Check for HTML easy questions
    const { count: htmlEasyBefore } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'html')
      .eq('level', 'easy');
    
    console.log(`   HTML easy questions before: ${htmlEasyBefore || 0}`);

    // STEP 2: Standardize existing questions
    console.log('\n🔄 STEP 2: Standardizing existing questions...\n');
    
    // Get all questions
    const { data: allQuestions } = await supabase
      .from('questions')
      .select('*');

    if (allQuestions && allQuestions.length > 0) {
      console.log(`   Processing ${allQuestions.length} existing questions...`);
      
      for (const q of allQuestions) {
        const updates: any = {};
        let needsUpdate = false;

        // Normalize skill
        const normalizedSkill = q.skill.toLowerCase().trim().replace(/\s+/g, '');
        if (normalizedSkill !== q.skill) {
          updates.skill = normalizedSkill;
          needsUpdate = true;
        }

        // Normalize level
        let normalizedLevel = q.level.toLowerCase().trim();
        if (['basic', 'beginner'].includes(normalizedLevel)) {
          normalizedLevel = 'easy';
        } else if (['intermediate', 'inter'].includes(normalizedLevel)) {
          normalizedLevel = 'medium';
        } else if (['advanced', 'expert'].includes(normalizedLevel)) {
          normalizedLevel = 'hard';
        }
        
        if (normalizedLevel !== q.level) {
          updates.level = normalizedLevel;
          needsUpdate = true;
        }

        // Update if needed
        if (needsUpdate) {
          await supabase
            .from('questions')
            .update(updates)
            .eq('id', q.id);
        }
      }
      
      console.log('   ✅ Standardization complete');
    }

    // STEP 3: Upload HTML easy questions from CSV
    console.log('\n📤 STEP 3: Uploading HTML easy questions from CSV...\n');
    
    const csvPath = './client/dist/assets/html_easy_questions.csv';
    
    if (!fs.existsSync(csvPath)) {
      console.log('   ⚠️  CSV file not found, skipping upload');
    } else {
      const fileContent = fs.readFileSync(csvPath, 'utf-8');
      const parseResult = Papa.parse<CSVRow>(fileContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_')
      });

      const rows = parseResult.data;
      console.log(`   Found ${rows.length} questions in CSV`);

      // Check for duplicates before inserting
      const questionsToInsert = [];
      
      for (const row of rows) {
        const normalizedSkill = 'html';
        const normalizedLevel = 'easy';
        
        // Check if question already exists
        const { data: existing } = await supabase
          .from('questions')
          .select('id')
          .eq('question', row.question.trim())
          .eq('skill', normalizedSkill)
          .eq('level', normalizedLevel)
          .limit(1);

        if (!existing || existing.length === 0) {
          const options = [];
          if (row.option_a) options.push(row.option_a.trim());
          if (row.option_b) options.push(row.option_b.trim());
          if (row.option_c) options.push(row.option_c.trim());
          if (row.option_d) options.push(row.option_d.trim());

          const randomId = Math.random().toString(36).substring(2, 15);
          const uniqueId = `html-easy-${Date.now()}-${randomId}`;

          questionsToInsert.push({
            question_id: uniqueId,
            skill: normalizedSkill,
            level: normalizedLevel,
            type: 'mcq',
            question: row.question.trim(),
            options: options,
            correct_answer: row.correct_answer.trim(),
            explanation: row.explanation?.trim() || '',
            verified: true,
            usage_count: 0
          });
        }
      }

      if (questionsToInsert.length > 0) {
        console.log(`   Inserting ${questionsToInsert.length} new questions...`);
        
        const { error } = await supabase
          .from('questions')
          .insert(questionsToInsert);

        if (error) {
          console.error(`   ❌ Error inserting questions: ${error.message}`);
        } else {
          console.log(`   ✅ Successfully inserted ${questionsToInsert.length} questions`);
        }
      } else {
        console.log('   ℹ️  All questions already exist in database');
      }
    }

    // STEP 4: Remove duplicates
    console.log('\n🗑️  STEP 4: Removing duplicates...\n');
    
    const { data: duplicates } = await supabase
      .from('questions')
      .select('question, skill, level, id, created_at')
      .order('created_at', { ascending: true });

    if (duplicates) {
      const seen = new Map();
      const toDelete = [];

      for (const q of duplicates) {
        const key = `${q.question}-${q.skill}-${q.level}`;
        if (seen.has(key)) {
          toDelete.push(q.id);
        } else {
          seen.set(key, q.id);
        }
      }

      if (toDelete.length > 0) {
        console.log(`   Found ${toDelete.length} duplicates, removing...`);
        
        for (const id of toDelete) {
          await supabase
            .from('questions')
            .delete()
            .eq('id', id);
        }
        
        console.log('   ✅ Duplicates removed');
      } else {
        console.log('   ✅ No duplicates found');
      }
    }

    // STEP 5: Final verification
    console.log('\n✅ STEP 5: Final verification...\n');
    
    const { count: totalAfter } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });
    
    const { count: htmlEasyAfter } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'html')
      .eq('level', 'easy');

    console.log('='.repeat(60));
    console.log('📊 RESULTS:');
    console.log('='.repeat(60));
    console.log(`   Total questions: ${totalBefore || 0} → ${totalAfter || 0}`);
    console.log(`   HTML easy questions: ${htmlEasyBefore || 0} → ${htmlEasyAfter || 0}`);
    console.log('='.repeat(60));

    if (htmlEasyAfter && htmlEasyAfter > 0) {
      console.log('\n✅ SUCCESS! HTML easy questions are now available.');
      console.log('\n   You can now use the evaluation system with:');
      console.log('   - Skill: html');
      console.log('   - Level: easy');
    } else {
      console.log('\n⚠️  WARNING: No HTML easy questions found after fix.');
      console.log('   Please check the CSV file and try again.');
    }

    // Show breakdown by skill
    console.log('\n📊 Questions by skill and level:');
    const { data: breakdown } = await supabase
      .from('questions')
      .select('skill, level');

    if (breakdown) {
      const counts = new Map();
      for (const q of breakdown) {
        const key = `${q.skill}-${q.level}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      }

      const sorted = Array.from(counts.entries()).sort();
      for (const [key, count] of sorted) {
        console.log(`   ${key}: ${count}`);
      }
    }

  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the fix
fixQuestionsDatabase();
