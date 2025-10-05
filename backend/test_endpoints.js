const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
const TEST_TOKEN = 'your-test-token-here'; // Получите через логин

async function testEndpoints() {
  try {
    console.log('🔍 Testing Admin Endpoints...\n');

    // Тест создания слона
    console.log('1. Testing create slon...');
    try {
      const slonResponse = await axios.post(`${BASE_URL}/admin/slons`, {
        username: 'test_slon',
        display_name: 'Test Slon',
        password: 'test123',
        contact_phone: '+79990000001',
        contact_email: 'test@slon.ru'
      }, {
        headers: { Authorization: `Bearer ${TEST_TOKEN}` }
      });
      console.log('✅ Create slon: SUCCESS');
    } catch (error) {
      console.log('❌ Create slon: FAILED -', error.response?.data || error.message);
    }

    // Тест создания вахты
    console.log('\n2. Testing create vakhta...');
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const in30Days = new Date();
      in30Days.setDate(in30Days.getDate() + 30);

      const vakhtaResponse = await axios.post(`${BASE_URL}/admin/vakhtas`, {
        title: 'Test Vakhta',
        description: 'Test Description',
        location: 'Test Location',
        total_places: 10,
        start_date: tomorrow.toISOString().split('T')[0],
        end_date: in30Days.toISOString().split('T')[0],
        requirements: 'Test requirements',
        conditions: 'Test conditions'
      }, {
        headers: { Authorization: `Bearer ${TEST_TOKEN}` }
      });
      console.log('✅ Create vakhta: SUCCESS');
    } catch (error) {
      console.log('❌ Create vakhta: FAILED -', error.response?.data || error.message);
    }

    // Тест создания промокода
    console.log('\n3. Testing create promo code...');
    try {
      const promoResponse = await axios.post(`${BASE_URL}/admin/promocodes`, {
        code: 'TEST2024',
        description: 'Test promo code',
        slon_id: 1 // ID существующего слона
      }, {
        headers: { Authorization: `Bearer ${TEST_TOKEN}` }
      });
      console.log('✅ Create promo code: SUCCESS');
    } catch (error) {
      console.log('❌ Create promo code: FAILED -', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('Test suite error:', error);
  }
}

testEndpoints();