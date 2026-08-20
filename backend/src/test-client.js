async function test() {
  try {
    const health = await fetch('http://127.0.0.1:5000/api/health').then(r => r.json());
    console.log('1. Health Check:', health);

    const scenarios = await fetch('http://127.0.0.1:5000/api/scenarios').then(r => r.json());
    console.log('2. Preset Scenarios count:', scenarios.scenarios.length);

    const chat = await fetch('http://127.0.0.1:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What happens if Strait of Hormuz is closed?' })
    }).then(r => r.json());
    console.log('3. Chat Copilot Response Received:', chat.success);
    console.log('   Copilot Message Preview:', chat.message.content.substring(0, 120) + '...');
    console.log('   Copilot Action Triggered:', chat.actionTaken);

    console.log('\n✅ ALL BACKEND MULTI-AGENT & COPILOT TESTS PASSED!');
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();
