const { testConnection } = require('./config/database');

async function testDeploy() {
  console.log('🧪 Testing deployment configuration...');

  // Тест подключения к БД
  const dbSuccess = await testConnection();

  console.log('\n=== 📊 TEST RESULTS ===');
  console.log('Database Connection:', dbSuccess ? '✅ PASS' : '❌ FAIL');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('=======================\n');

  if (dbSuccess) {
    console.log('✅ All tests passed! Ready for deployment.');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Check configuration.');
    process.exit(1);
  }
}

testDeploy();