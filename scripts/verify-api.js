// scripts/verify-api.ts
import { getAuthApiUrl } from './src/lib/api-urls';

const endpoints: Array<'LOGIN' | 'VALIDATE' | 'PROFILE'> = ['LOGIN', 'VALIDATE', 'PROFILE'];

console.log('🔍 Verifying API endpoints...\n');

endpoints.forEach(endpoint => {
    const url = getAuthApiUrl(endpoint);
    console.log(`${endpoint}: ${url}`);

    // You could add fetch calls here to test connectivity
});

console.log('\n✅ Endpoints configured');
console.log('\nTo test connectivity, run:');
console.log('curl -X POST http://localhost:3001/api/auth/validate \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"token":"test"}\'');