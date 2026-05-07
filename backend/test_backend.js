
async function testEndpoints() {
    const baseUrl = 'http://localhost:5000/api';
    console.log('--- Starting Backend Verification ---');

    try {
        // 1. Root
        try {
            const rootRes = await fetch('http://localhost:5000/');
            const rootText = await rootRes.text();
            console.log(`[PASS] Root Endpoint: ${rootText}`);
        } catch (e) {
            console.error(`[FAIL] Root Endpoint: ${e.message}`);
        }

        // 2. Products
        try {
            const prodRes = await fetch(`${baseUrl}/products`);
            const prodData = await prodRes.json();
            console.log(`[PASS] Products API: Found ${prodData.length} products`);
        } catch (e) {
            console.error(`[FAIL] Products API: ${e.message}`);
        }

        // 3. Categories
        try {
            const catRes = await fetch(`${baseUrl}/categories`);
            const catData = await catRes.json();
            console.log(`[PASS] Categories API: Found ${catData.length} categories`);
        } catch (e) {
            console.error(`[FAIL] Categories API: ${e.message}`);
        }

        // 4. Banners
        try {
            const bannerRes = await fetch(`${baseUrl}/banners`);
            const bannerData = await bannerRes.json();
            console.log(`[PASS] Banners API: Found ${bannerData.length} banners`);
        } catch (e) {
            console.error(`[FAIL] Banners API: ${e.message}`);
        }

    } catch (err) {
        console.error('Fatal Error:', err);
    }
    console.log('--- Verification Complete ---');
}

testEndpoints();
