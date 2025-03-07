const fetch = require('node-fetch');

const testEndpoint = async (method, path, body = null) => {
    const url = `http://localhost:5000${path}`;
    console.log(`\nTesting ${method} ${url}`);
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        console.log('Status:', response.status);
        console.log('StatusText:', response.statusText);
        
        const data = await response.json();
        console.log('Response:', data);
        
        return { success: response.ok, data };
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, error };
    }
};

async function runTests() {
    console.log('Starting API Tests...\n');

    // Test 1: Basic API test
    const test1 = await testEndpoint('GET', '/api/test');
    if (!test1.success) process.exit(1);

    // Test 2: Chat endpoint
    const test2 = await testEndpoint('POST', '/api/chat', {
        message: 'test message',
        prescriptions: []
    });
    if (!test2.success) process.exit(1);

    console.log('\nAll tests completed!');
}

runTests();
