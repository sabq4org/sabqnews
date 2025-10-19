const postgres = require('postgres');

// الاتصال بقاعدة البيانات
const connectionString = "postgres://postgres.ktwlrwxtpspnflarvzoo:BVyhrcNHCxzrmOCj@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

const sql = postgres(connectionString, {
  prepare: false,
  max: 1,
});

async function testLoginQuery() {
  try {
    console.log('🔍 اختبار استعلام تسجيل الدخول...\n');
    
    const email = 'admin@sabq.org';
    
    console.log(`📧 البحث عن المستخدم: ${email}`);
    console.time('⏱️  وقت الاستعلام');
    
    const users = await sql`
      SELECT * FROM users 
      WHERE email = ${email}
      LIMIT 1;
    `;
    
    console.timeEnd('⏱️  وقت الاستعلام');
    
    if (users.length > 0) {
      console.log('\n✅ تم العثور على المستخدم:');
      console.log(`  - ID: ${users[0].id}`);
      console.log(`  - Name: ${users[0].name}`);
      console.log(`  - Email: ${users[0].email}`);
      console.log(`  - Role: ${users[0].role}`);
      console.log(`  - Has Password: ${!!users[0].password}`);
      console.log(`  - Is Active: ${users[0].is_active}`);
    } else {
      console.log('\n❌ لم يتم العثور على المستخدم');
    }
    
    await sql.end();
    console.log('\n✅ تم الاختبار بنجاح');
  } catch (error) {
    console.error('❌ خطأ:', error);
    await sql.end();
    process.exit(1);
  }
}

testLoginQuery();

