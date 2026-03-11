import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface SkillCount {
  skill: string;
  basic: number;
  intermediate: number;
  advanced: number;
  total: number;
}

async function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 PRACTICE QUESTIONS DATABASE REPORT');
  console.log('='.repeat(80) + '\n');

  try {
    // Get all questions
    const { data: questions, error } = await supabase
      .from('practice_questions')
      .select('skill, level');

    if (error) throw error;

    if (!questions || questions.length === 0) {
      console.log('⚠️  No questions found in database\n');
      return;
    }

    // Group by skill
    const skillMap = new Map<string, SkillCount>();

    questions.forEach(q => {
      if (!skillMap.has(q.skill)) {
        skillMap.set(q.skill, {
          skill: q.skill,
          basic: 0,
          intermediate: 0,
          advanced: 0,
          total: 0
        });
      }

      const skill = skillMap.get(q.skill)!;
      skill.total++;

      if (q.level === 'Basic') skill.basic++;
      else if (q.level === 'Intermediate') skill.intermediate++;
      else if (q.level === 'Advanced') skill.advanced++;
    });

    // Convert to array and sort
    const skills = Array.from(skillMap.values()).sort((a, b) => 
      a.skill.localeCompare(b.skill)
    );

    // Calculate totals
    const totals = {
      basic: skills.reduce((sum, s) => sum + s.basic, 0),
      intermediate: skills.reduce((sum, s) => sum + s.intermediate, 0),
      advanced: skills.reduce((sum, s) => sum + s.advanced, 0),
      total: skills.reduce((sum, s) => sum + s.total, 0)
    };

    // Print header
    console.log('┌─────────────────────────┬───────┬──────────────┬──────────┬───────┬──────────┐');
    console.log('│ Skill                   │ Basic │ Intermediate │ Advanced │ Total │ Status   │');
    console.log('├─────────────────────────┼───────┼──────────────┼──────────┼───────┼──────────┤');

    // Print each skill
    skills.forEach(skill => {
      const status = 
        skill.basic >= 50 && skill.intermediate >= 50 && skill.advanced >= 50 ? '✅ Ready' :
        skill.total >= 100 ? '⚠️ Partial' :
        skill.total > 0 ? '🔨 Building' :
        '❌ Empty';

      const skillName = skill.skill.padEnd(23).substring(0, 23);
      const basicStr = skill.basic.toString().padStart(5);
      const intStr = skill.intermediate.toString().padStart(12);
      const advStr = skill.advanced.toString().padStart(8);
      const totalStr = skill.total.toString().padStart(5);
      const statusStr = status.padEnd(8);

      console.log(`│ ${skillName} │ ${basicStr} │ ${intStr} │ ${advStr} │ ${totalStr} │ ${statusStr} │`);
    });

    // Print footer with totals
    console.log('├─────────────────────────┼───────┼──────────────┼──────────┼───────┼──────────┤');
    const totalStr = `${skills.length} skills`.padEnd(23);
    const basicTotal = totals.basic.toString().padStart(5);
    const intTotal = totals.intermediate.toString().padStart(12);
    const advTotal = totals.advanced.toString().padStart(8);
    const grandTotal = totals.total.toString().padStart(5);
    console.log(`│ ${totalStr} │ ${basicTotal} │ ${intTotal} │ ${advTotal} │ ${grandTotal} │          │`);
    console.log('└─────────────────────────┴───────┴──────────────┴──────────┴───────┴──────────┘\n');

    // Summary statistics
    const completeSkills = skills.filter(s => 
      s.basic >= 50 && s.intermediate >= 50 && s.advanced >= 50
    ).length;
    const partialSkills = skills.filter(s => 
      s.total >= 100 && !(s.basic >= 50 && s.intermediate >= 50 && s.advanced >= 50)
    ).length;
    const incompleteSkills = skills.length - completeSkills - partialSkills;

    console.log('📈 SUMMARY:');
    console.log(`   Total Skills: ${skills.length}`);
    console.log(`   ✅ Complete (50+ per level): ${completeSkills}`);
    console.log(`   ⚠️  Partial (100+ total): ${partialSkills}`);
    console.log(`   🔨 Incomplete: ${incompleteSkills}`);
    console.log(`   📝 Total Questions: ${totals.total.toLocaleString()}\n`);

    // Skills needing attention
    const needsWork = skills.filter(s => 
      s.basic < 50 || s.intermediate < 50 || s.advanced < 50
    );

    if (needsWork.length > 0) {
      console.log('⚠️  SKILLS NEEDING MORE QUESTIONS:\n');
      needsWork.forEach(skill => {
        const needs = [];
        if (skill.basic < 50) needs.push(`Basic: ${50 - skill.basic} more`);
        if (skill.intermediate < 50) needs.push(`Intermediate: ${50 - skill.intermediate} more`);
        if (skill.advanced < 50) needs.push(`Advanced: ${50 - skill.advanced} more`);
        
        console.log(`   ${skill.skill}: ${needs.join(', ')}`);
      });
      console.log('');
    }

    // Check for non-standard levels
    const nonStandardLevels = questions.filter(q => 
      !['Basic', 'Intermediate', 'Advanced'].includes(q.level)
    );

    if (nonStandardLevels.length > 0) {
      console.log('⚠️  WARNING: Non-standard level names found!');
      console.log(`   ${nonStandardLevels.length} questions need level name fixes`);
      console.log('   Run: FIX_ALL_SKILLS_LEVELS_COMPLETE.sql\n');
    }

    // Save report to file
    const reportPath = 'QUESTION_DATABASE_REPORT.txt';
    const reportContent = generateTextReport(skills, totals, completeSkills, partialSkills, incompleteSkills);
    fs.writeFileSync(reportPath, reportContent);
    console.log(`💾 Report saved to: ${reportPath}\n`);

    console.log('='.repeat(80) + '\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function generateTextReport(
  skills: SkillCount[], 
  totals: any, 
  complete: number, 
  partial: number, 
  incomplete: number
): string {
  let report = '';
  report += '='.repeat(80) + '\n';
  report += 'PRACTICE QUESTIONS DATABASE REPORT\n';
  report += 'Generated: ' + new Date().toLocaleString() + '\n';
  report += '='.repeat(80) + '\n\n';

  report += 'SKILL BREAKDOWN:\n';
  report += '-'.repeat(80) + '\n';
  skills.forEach(skill => {
    const status = 
      skill.basic >= 50 && skill.intermediate >= 50 && skill.advanced >= 50 ? 'COMPLETE' :
      skill.total >= 100 ? 'PARTIAL' : 'INCOMPLETE';
    
    report += `${skill.skill.padEnd(25)} | Basic: ${skill.basic.toString().padStart(3)} | Int: ${skill.intermediate.toString().padStart(3)} | Adv: ${skill.advanced.toString().padStart(3)} | Total: ${skill.total.toString().padStart(3)} | ${status}\n`;
  });

  report += '\n' + '='.repeat(80) + '\n';
  report += 'SUMMARY:\n';
  report += `Total Skills: ${skills.length}\n`;
  report += `Complete Skills: ${complete}\n`;
  report += `Partial Skills: ${partial}\n`;
  report += `Incomplete Skills: ${incomplete}\n`;
  report += `Total Questions: ${totals.total}\n`;
  report += '='.repeat(80) + '\n';

  return report;
}

generateReport().catch(console.error);
