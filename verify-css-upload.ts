import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ksjgsgebjnpwyycnptom.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzamdzZ2Viam5wd3l5Y25wdG9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTAzMzk0MSwiZXhwIjoyMDg0NjA5OTQxfQ.9Y2JuAmAXSU7vXZB-UaLQkCw5iddITkJcVTRi6bTfd0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyUpload() {
  console.log('🔍 Verifying Questions Upload...\n');

  try {
    // HTML Questions
    const { count: htmlBasic } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'html')
      .eq('level', 'easy');

    const { count: htmlMedium } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'html')
      .eq('level', 'medium');

    const { count: htmlHard } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'html')
      .eq('level', 'hard');

    const { count: totalHtml } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'html');

    // CSS Questions
    const { count: cssBasic } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'css')
      .eq('level', 'easy');

    const { count: cssMedium } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'css')
      .eq('level', 'medium');

    const { count: cssHard } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'css')
      .eq('level', 'hard');

    const { count: totalCss } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'css');

    // JavaScript Questions
    const { count: jsBasic } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'javascript')
      .eq('level', 'easy');

    const { count: jsMedium } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'javascript')
      .eq('level', 'medium');

    const { count: jsHard } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'javascript')
      .eq('level', 'hard');

    const { count: totalJs } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'javascript');

    // OGL Questions
    const { count: oglBasic } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'ogl')
      .eq('level', 'easy');

    const { count: oglMedium } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'ogl')
      .eq('level', 'medium');

    const { count: oglHard } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'ogl')
      .eq('level', 'hard');

    const { count: totalOgl } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'ogl');

    // jQuery Questions
    const { count: jqBasic } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'jquery')
      .eq('level', 'easy');

    const { count: jqMedium } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'jquery')
      .eq('level', 'medium');

    const { count: jqHard } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'jquery')
      .eq('level', 'hard');

    const { count: totalJq } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'jquery');

    console.log('📊 HTML Questions in Database:');
    console.log('   BASIC (easy): ', htmlBasic || 0);
    console.log('   MEDIUM:       ', htmlMedium || 0);
    console.log('   HARD:         ', htmlHard || 0);
    console.log('   ─────────────────────');
    console.log('   TOTAL HTML:   ', totalHtml || 0);

    console.log('\n📊 CSS Questions in Database:');
    console.log('   BASIC (easy): ', cssBasic || 0);
    console.log('   MEDIUM:       ', cssMedium || 0);
    console.log('   HARD:         ', cssHard || 0);
    console.log('   ─────────────────────');
    console.log('   TOTAL CSS:    ', totalCss || 0);

    console.log('\n📊 JavaScript Questions in Database:');
    console.log('   BASIC (easy): ', jsBasic || 0);
    console.log('   MEDIUM:       ', jsMedium || 0);
    console.log('   HARD:         ', jsHard || 0);
    console.log('   ─────────────────────');
    console.log('   TOTAL JS:     ', totalJs || 0);

    console.log('\n📊 OGL Questions in Database:');
    console.log('   BASIC (easy): ', oglBasic || 0);
    console.log('   MEDIUM:       ', oglMedium || 0);
    console.log('   HARD:         ', oglHard || 0);
    console.log('   ─────────────────────');
    console.log('   TOTAL OGL:    ', totalOgl || 0);

    console.log('\n📊 jQuery Questions in Database:');
    console.log('   BASIC (easy): ', jqBasic || 0);
    console.log('   MEDIUM:       ', jqMedium || 0);
    console.log('   HARD:         ', jqHard || 0);
    console.log('   ─────────────────────');
    console.log('   TOTAL jQuery: ', totalJq || 0);

    console.log('\n📊 GRAND TOTAL:   ', (totalHtml || 0) + (totalCss || 0) + (totalJs || 0) + (totalOgl || 0) + (totalJq || 0));

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

verifyUpload();
