/**
 * اختبار شات بوت SmartFly
 * لتجربة وظائف الشات بوت المحسّن
 */

const advancedChatbotService = require('./services/advancedChatbotService');
const knowledgeBase = require('./services/chatbotKnowledgeBase');

async function testChatbot() {
  console.log('🤖 اختبار شات بوت SmartFly المحسّن\n');
  
  const testMessages = [
    'أريد رحلة من عمان إلى دبي',
    'كم سعر رحلة إلى القاهرة؟',
    'معلومات عن الملكية الأردنية',
    'أريد حجز تذكرة',
    'ما هي سياسة الأمتعة؟',
    'هل هناك رحلات مباشرة إلى بيروت؟',
    'خدمة العملاء',
    'عروض خاصة',
    'أريد رحلة رخيصة',
    'متى مواعيد الإقلاع؟'
  ];

  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i];
    console.log(`\n${i + 1}. المستخدم: ${message}`);
    console.log('-'.repeat(50));
    
    try {
      const response = await advancedChatbotService.processMessage(message, 'test-user', 'ar');
      console.log(`🤖 الشات بوت: ${response.text.substring(0, 200)}...`);
      
      if (response.suggestions && response.suggestions.length > 0) {
        console.log(`💡 الاقتراحات: ${response.suggestions.join(', ')}`);
      }
    } catch (error) {
      console.log(`❌ خطأ: ${error.message}`);
    }
    
    console.log('\n' + '='.repeat(60));
  }

  console.log('\n✅ انتهى اختبار الشات بوت');
}

// اختبار قاعدة المعارف
function testKnowledgeBase() {
  console.log('\n📚 اختبار قاعدة المعارف\n');
  
  // اختبار البحث عن شركات الطيران
  const airlineInfo = knowledgeBase.getAirlineInfo('RJ');
  console.log('معلومات الملكية الأردنية:', airlineInfo ? '✅ نجح' : '❌ فشل');
  
  // اختبار البحث عن الوجهات
  const destinationInfo = knowledgeBase.getDestinationInfo('دبي');
  console.log('معلومات دبي:', destinationInfo ? '✅ نجح' : '❌ فشل');
  
  // اختبار معلومات الأسعار
  const pricingInfo = knowledgeBase.getPricingInfo('عمان', 'دبي');
  console.log('معلومات الأسعار:', pricingInfo ? '✅ نجح' : '❌ فشل');
  
  // اختبار البحث الشامل
  const searchResults = knowledgeBase.search('الملكية الأردنية');
  console.log(`البحث الشامل: ${searchResults.airlines.length} شركة طيران`);
}

// تشغيل الاختبارات
if (require.main === module) {
  testKnowledgeBase();
  testChatbot().catch(console.error);
}

module.exports = { testChatbot, testKnowledgeBase };
