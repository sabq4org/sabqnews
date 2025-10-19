const postgres = require('postgres');

// الاتصال بقاعدة البيانات
const connectionString = "postgres://postgres.ktwlrwxtpspnflarvzoo:BVyhrcNHCxzrmOCj@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

const sql = postgres(connectionString, {
  prepare: false,
  max: 1,
});

async function checkIndexes() {
  try {
    console.log('🔍 فحص الفهارس (Indexes) في قاعدة البيانات...\n');
    
    // فحص الفهارس على جدول articles
    console.log('📊 الفهارس على جدول articles:');
    const articlesIndexes = await sql`
      SELECT 
        indexname, 
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'articles'
      ORDER BY indexname;
    `;
    articlesIndexes.forEach(idx => {
      console.log(`  - ${idx.indexname}`);
      console.log(`    ${idx.indexdef}\n`);
    });
    
    // فحص الفهارس على جدول users
    console.log('\n📊 الفهارس على جدول users:');
    const usersIndexes = await sql`
      SELECT 
        indexname, 
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'users'
      ORDER BY indexname;
    `;
    usersIndexes.forEach(idx => {
      console.log(`  - ${idx.indexname}`);
      console.log(`    ${idx.indexdef}\n`);
    });
    
    // فحص الفهارس على جدول categories
    console.log('\n📊 الفهارس على جدول categories:');
    const categoriesIndexes = await sql`
      SELECT 
        indexname, 
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'categories'
      ORDER BY indexname;
    `;
    categoriesIndexes.forEach(idx => {
      console.log(`  - ${idx.indexname}`);
      console.log(`    ${idx.indexdef}\n`);
    });
    
    // عدد الصفوف في كل جدول
    console.log('\n📈 عدد الصفوف في الجداول:');
    const articlesCount = await sql`SELECT COUNT(*) as count FROM articles`;
    console.log(`  - articles: ${articlesCount[0].count} صفوف`);
    
    const usersCount = await sql`SELECT COUNT(*) as count FROM users`;
    console.log(`  - users: ${usersCount[0].count} صفوف`);
    
    const categoriesCount = await sql`SELECT COUNT(*) as count FROM categories`;
    console.log(`  - categories: ${categoriesCount[0].count} صفوف`);
    
    await sql.end();
    console.log('\n✅ تم الفحص بنجاح');
  } catch (error) {
    console.error('❌ خطأ:', error);
    await sql.end();
    process.exit(1);
  }
}

checkIndexes();

