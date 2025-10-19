const postgres = require('postgres');

// الاتصال بقاعدة البيانات
const connectionString = "postgres://postgres.ktwlrwxtpspnflarvzoo:BVyhrcNHCxzrmOCj@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

const sql = postgres(connectionString, {
  prepare: false,
  max: 1,
});

async function addMissingIndexes() {
  try {
    console.log('🔧 إضافة الفهارس المفقودة...\n');
    
    // إضافة فهرس created_at على جدول articles
    console.log('📊 إضافة فهرس articles_created_at_idx...');
    try {
      await sql`
        CREATE INDEX IF NOT EXISTS articles_created_at_idx 
        ON articles (created_at DESC);
      `;
      console.log('✅ تم إضافة فهرس articles_created_at_idx بنجاح\n');
    } catch (error) {
      if (error.code === '42P07') {
        console.log('ℹ️  الفهرس موجود بالفعل\n');
      } else {
        throw error;
      }
    }
    
    // التحقق من الفهارس الجديدة
    console.log('🔍 التحقق من الفهارس على جدول articles:');
    const articlesIndexes = await sql`
      SELECT 
        indexname, 
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'articles'
      AND indexname LIKE '%created%'
      ORDER BY indexname;
    `;
    
    if (articlesIndexes.length > 0) {
      articlesIndexes.forEach(idx => {
        console.log(`  ✓ ${idx.indexname}`);
        console.log(`    ${idx.indexdef}\n`);
      });
    } else {
      console.log('  ⚠️  لم يتم العثور على فهرس created_at\n');
    }
    
    await sql.end();
    console.log('✅ تمت العملية بنجاح');
  } catch (error) {
    console.error('❌ خطأ:', error);
    await sql.end();
    process.exit(1);
  }
}

addMissingIndexes();

