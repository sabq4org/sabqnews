import bcrypt from 'bcryptjs';

async function generateHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 12);
  
  console.log('Password:', password);
  console.log('Hash:', hash);
  
  // اختبار التحقق
  const isValid = await bcrypt.compare(password, hash);
  console.log('Verification test:', isValid ? '✅ SUCCESS' : '❌ FAILED');
  
  // SQL للتحديث
  console.log('\nSQL to run in Supabase:');
  console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@sabq.org';`);
}

generateHash();

