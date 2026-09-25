import http from 'http';
import { pool, query } from '../server/config/db.js';

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

// Helper for making HTTP requests
function request(
  method: string,
  path: string,
  data?: any,
  token?: string
): Promise<{ status: number; body: any; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const postData = data ? JSON.stringify(data) : '';

    const options: http.RequestOptions = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let bodyStr = '';
      res.on('data', (chunk) => {
        bodyStr += chunk;
      });
      res.on('end', () => {
        let body: any;
        try {
          body = JSON.parse(bodyStr);
        } catch {
          body = bodyStr;
        }
        resolve({ status: res.statusCode || 500, body, headers: res.headers });
      });
    });

    req.on('error', (e) => reject(e));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runVerification() {
  console.log('========================================================');
  console.log('🧪 SMART TRAVEL PLANNER - FULL VERIFICATION SUITE');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 6: Table row counts in Neon
    // ----------------------------------------------------
    console.log('--- Step 6: Verifying Record Counts in Neon Database ---');
    const districtsCount = await query('SELECT count(*)::int as count FROM districts');
    const destinationsCount = await query('SELECT count(*)::int as count FROM destinations');
    const foodCount = await query('SELECT count(*)::int as count FROM food_places');
    const accCount = await query('SELECT count(*)::int as count FROM accommodations');
    const interestsCount = await query('SELECT count(*)::int as count FROM interests');
    const startingCount = await query('SELECT count(*)::int as count FROM starting_locations');

    assert(districtsCount.rows[0].count === 11, '11 Districts in PostgreSQL', `Got ${districtsCount.rows[0].count}`);
    assert(destinationsCount.rows[0].count === 49, '49 Destinations in PostgreSQL', `Got ${destinationsCount.rows[0].count}`);
    assert(foodCount.rows[0].count === 21, '21 Food Places in PostgreSQL', `Got ${foodCount.rows[0].count}`);
    assert(accCount.rows[0].count === 33, '33 Accommodations in PostgreSQL', `Got ${accCount.rows[0].count}`);
    assert(interestsCount.rows[0].count === 14, '14 Interests in PostgreSQL', `Got ${interestsCount.rows[0].count}`);
    assert(startingCount.rows[0].count === 14, '14 Starting Locations in PostgreSQL', `Got ${startingCount.rows[0].count}`);

    // ----------------------------------------------------
    // TEST 7: Foreign Key Integrity & No Orphan Records
    // ----------------------------------------------------
    console.log('\n--- Step 7: Verifying Foreign Key Integrity ---');
    const orphanDest = await query(`
      SELECT count(*)::int as count FROM destinations WHERE district_id NOT IN (SELECT id FROM districts);
    `);
    const orphanFood = await query(`
      SELECT count(*)::int as count FROM food_places WHERE district_id NOT IN (SELECT id FROM districts);
    `);
    const orphanAcc = await query(`
      SELECT count(*)::int as count FROM accommodations WHERE district_id NOT IN (SELECT id FROM districts);
    `);

    assert(orphanDest.rows[0].count === 0, 'No orphan destinations', `Found ${orphanDest.rows[0].count}`);
    assert(orphanFood.rows[0].count === 0, 'No orphan food places', `Found ${orphanFood.rows[0].count}`);
    assert(orphanAcc.rows[0].count === 0, 'No orphan accommodations', `Found ${orphanAcc.rows[0].count}`);

    // ----------------------------------------------------
    // TEST 8: /api/health database connectivity
    // ----------------------------------------------------
    console.log('\n--- Step 8: Testing /api/health Endpoint ---');
    const healthRes = await request('GET', '/api/health');
    assert(healthRes.status === 200, '/api/health responds with 200');
    assert(healthRes.body.database?.connected === true, '/api/health reports database.connected = true');
    assert(healthRes.body.database?.counts?.districts === 11, '/api/health reports 11 districts in DB counts');
    assert(healthRes.body.database?.counts?.destinations === 49, '/api/health reports 49 destinations in DB counts');

    // ----------------------------------------------------
    // TEST 9: User Registration in Neon PostgreSQL
    // ----------------------------------------------------
    console.log('\n--- Step 9: Testing Registration & DB Persistence ---');
    const testEmail = `traveler_${Date.now()}@karnatakaguide.test`;
    const testPassword = 'SecurePassword2026!';
    const testName = 'Karnataka Rover';

    const regRes = await request('POST', '/api/auth/register', {
      name: testName,
      email: testEmail,
      password: testPassword,
      travelStyle: 'Nature & Adventure',
      budgetPreference: 'Moderate',
      interests: ['Nature', 'Waterfalls', 'Heritage'],
    });

    assert(regRes.status === 201, 'Registration returns HTTP 201');
    assert(!!regRes.body.token, 'Registration returns JWT token');
    const registeredUserId = regRes.body.user?.id;
    assert(!!registeredUserId, 'Registration returns user ID');

    // Verify user is in PostgreSQL
    const userInDb = await query('SELECT id, name, email, travel_style FROM users WHERE id = $1', [registeredUserId]);
    assert(userInDb.rows.length === 1, 'User record is stored in PostgreSQL table "users"');
    assert(userInDb.rows[0]?.email === testEmail.toLowerCase(), 'Stored user email matches registered email');

    // ----------------------------------------------------
    // TEST 10: Login & Authenticated /api/auth/me
    // ----------------------------------------------------
    console.log('\n--- Step 10: Testing Login & Authenticated /api/auth/me ---');
    const loginRes = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: testPassword,
    });

    assert(loginRes.status === 200, 'Login returns HTTP 200');
    const authToken = loginRes.body.token;
    assert(!!authToken, 'Login returns valid JWT');

    const meRes = await request('GET', '/api/auth/me', null, authToken);
    assert(meRes.status === 200, '/api/auth/me returns HTTP 200');
    assert(meRes.body.user?.id === registeredUserId, '/api/auth/me returns the registered user profile');

    // ----------------------------------------------------
    // TEST 11: Profile Retrieval and Update
    // ----------------------------------------------------
    console.log('\n--- Step 11: Testing Profile Retrieval and Update ---');
    const updateRes = await request('PUT', '/api/auth/profile', {
      name: 'Karnataka Rover Updated',
      travelStyle: 'Luxury Heritage',
      budgetPreference: 'Luxury',
      interests: ['Architecture', 'Food', 'Culture'],
    }, authToken);

    assert(updateRes.status === 200, 'PUT /api/auth/profile returns HTTP 200');
    assert(updateRes.body.user?.name === 'Karnataka Rover Updated', 'Profile name updated');
    assert(updateRes.body.user?.travelStyle === 'Luxury Heritage', 'Profile travelStyle updated');

    // Verify update persisted in DB
    const dbProfileCheck = await query('SELECT name, travel_style, budget_preference FROM users WHERE id = $1', [registeredUserId]);
    assert(dbProfileCheck.rows[0]?.travel_style === 'Luxury Heritage', 'User profile update persisted in PostgreSQL');

    // ----------------------------------------------------
    // TEST 12: Explore search, district filtering, category filtering, hidden-gem filtering
    // ----------------------------------------------------
    console.log('\n--- Step 12: Testing Explore Search & Filters ---');
    // Search
    const searchRes = await request('GET', '/api/destinations?search=Abbey');
    assert(searchRes.status === 200, 'Search query returns HTTP 200');
    assert(searchRes.body.destinations?.some((d: any) => d.name.includes('Abbey Falls')), 'Search returns Abbey Falls');

    // District filter
    const distFilterRes = await request('GET', '/api/destinations?district=kodagu');
    assert(distFilterRes.status === 200, 'District filter returns HTTP 200');
    assert(
      distFilterRes.body.destinations?.length > 0 &&
      distFilterRes.body.destinations.every((d: any) => d.districtId === 'kodagu'),
      'District filter returns only Kodagu destinations'
    );

    // Category filter
    const catFilterRes = await request('GET', '/api/destinations?category=Nature');
    assert(catFilterRes.status === 200, 'Category filter returns HTTP 200');
    assert(
      catFilterRes.body.destinations?.length > 0 &&
      catFilterRes.body.destinations.every((d: any) => d.categories.some((c: string) => c.toLowerCase() === 'nature')),
      'Category filter returns only Nature destinations'
    );

    // Hidden gem filter
    const hiddenFilterRes = await request('GET', '/api/destinations?hidden=true');
    assert(hiddenFilterRes.status === 200, 'Hidden gems filter returns HTTP 200');
    assert(
      hiddenFilterRes.body.destinations?.length > 0 &&
      hiddenFilterRes.body.destinations.every((d: any) => d.isHiddenGem === true),
      'Hidden gem filter returns only hidden gems'
    );

    // ----------------------------------------------------
    // TEST 13: District and Destination Detail APIs
    // ----------------------------------------------------
    console.log('\n--- Step 13: Testing District and Destination Detail APIs ---');
    const districtDetailRes = await request('GET', '/api/districts/kodagu');
    assert(districtDetailRes.status === 200, 'GET /api/districts/kodagu returns 200');
    assert(districtDetailRes.body.district?.name.includes('Kodagu'), 'District details match Kodagu');
    assert(districtDetailRes.body.destinations?.length > 0, 'District details include destinations list');
    assert(districtDetailRes.body.foodPlaces?.length > 0, 'District details include food places');
    assert(districtDetailRes.body.accommodations?.length > 0, 'District details include accommodations');

    const destDetailRes = await request('GET', '/api/destinations/abbey-falls');
    assert(destDetailRes.status === 200, 'GET /api/destinations/abbey-falls returns 200');
    assert(destDetailRes.body.destination?.name === 'Abbey Falls', 'Destination name matches Abbey Falls');
    assert(destDetailRes.body.district?.id === 'kodagu', 'Destination includes related district information');

    // ----------------------------------------------------
    // TEST 14 & 15: Trip Generation (Kodagu + Chikkamagaluru strictly isolated)
    // ----------------------------------------------------
    console.log('\n--- Step 14 & 15: Testing Trip Generation & Strict District Isolation ---');
    const tripPlan = {
      startingPoint: 'Bengaluru',
      selectedDistricts: ['kodagu', 'chikkamagaluru'],
      durationDays: 3,
      interests: ['Nature', 'Coffee Plantations', 'Waterfalls'],
      transport: 'Own Car',
      budgetTier: 'Moderate',
      travelersCount: 2,
      endPoint: 'Bengaluru',
    };

    const genRes = await request('POST', '/api/trips/generate', tripPlan, authToken);
    assert(genRes.status === 201, 'POST /api/trips/generate returns HTTP 201');
    const generatedTrip = genRes.body.trip;
    assert(!!generatedTrip, 'Trip generated successfully');
    assert(generatedTrip.durationDays === 3, 'Generated trip duration is 3 days');
    assert(generatedTrip.days?.length === 3, 'Generated trip has 3 day itineraries');

    // Strict district validation
    const allowedDistricts = ['kodagu', 'chikkamagaluru'];
    let allDestinationsValid = true;
    let foreignDistrictsFound: string[] = [];

    // Check each day's districtId and each item's districtName / location
    for (const day of generatedTrip.days) {
      if (!allowedDistricts.includes(day.districtId)) {
        allDestinationsValid = false;
        foreignDistrictsFound.push(`Day ${day.dayNumber}: ${day.districtName} (${day.districtId})`);
      }
      for (const item of day.items || []) {
        // If item has a districtName, verify it matches Kodagu or Chikkamagaluru (or starting/ending travel)
        if (item.type === 'place' || item.type === 'viewpoint' || item.type === 'activity') {
          const dName = (item.districtName || '').toLowerCase();
          if (dName && !dName.includes('kodagu') && !dName.includes('coorg') && !dName.includes('chikkamagaluru') && !dName.includes('chikmagalur')) {
            allDestinationsValid = false;
            foreignDistrictsFound.push(`${item.title} in ${item.districtName}`);
          }
        }
      }
    }

    assert(
      allDestinationsValid,
      'Every generated destination strictly belongs to Kodagu or Chikkamagaluru only',
      foreignDistrictsFound.join(', ')
    );

    // Verify trip was stored in PostgreSQL trips table
    const dbTripCheck = await query('SELECT id, user_id, title, selected_districts FROM trips WHERE id = $1', [generatedTrip.id]);
    assert(dbTripCheck.rows.length === 1, 'Generated trip saved into PostgreSQL "trips" table');
    assert(dbTripCheck.rows[0]?.user_id === registeredUserId, 'Generated trip assigned to authenticated user ID in DB');

    // ----------------------------------------------------
    // TEST 16: Saving/Bookmarking a Trip
    // ----------------------------------------------------
    console.log('\n--- Step 16: Testing Trip Bookmark / Toggle Save ---');
    const bookmarkRes = await request('PUT', `/api/trips/${generatedTrip.id}`, {
      isCustomSaved: true,
    }, authToken);
    assert(bookmarkRes.status === 200, 'PUT /api/trips/:id updates bookmark status');
    assert(bookmarkRes.body.trip?.isCustomSaved === true, 'Trip is marked as saved');

    // ----------------------------------------------------
    // TEST 17: Retrieving Saved Trips through My Trips
    // ----------------------------------------------------
    console.log('\n--- Step 17: Testing Retrieving Saved Trips (/api/trips) ---');
    const myTripsRes = await request('GET', '/api/trips', null, authToken);
    assert(myTripsRes.status === 200, 'GET /api/trips returns HTTP 200');
    assert(myTripsRes.body.trips?.some((t: any) => t.id === generatedTrip.id), 'Saved trip retrieved in user trips list');

    // ----------------------------------------------------
    // TEST 18: Deleting a Trip
    // ----------------------------------------------------
    console.log('\n--- Step 18: Testing Deleting a Trip ---');
    const deleteRes = await request('DELETE', `/api/trips/${generatedTrip.id}`, null, authToken);
    assert(deleteRes.status === 200, 'DELETE /api/trips/:id returns HTTP 200');

    // Verify deletion in database
    const dbTripAfterDelete = await query('SELECT id FROM trips WHERE id = $1', [generatedTrip.id]);
    assert(dbTripAfterDelete.rows.length === 0, 'Trip is deleted from PostgreSQL table');

    // ----------------------------------------------------
    // TEST 19: Persistence Check (users & trips stored in Neon)
    // ----------------------------------------------------
    console.log('\n--- Step 19: Testing Neon PostgreSQL Persistence ---');
    // Save a new trip to confirm permanent storage
    const persistentTripPayload = {
      id: `trip-persisted-${Date.now()}`,
      userId: registeredUserId,
      title: 'Persistent Western Ghats Explorer',
      startingPoint: 'Bengaluru',
      endPoint: 'Mangaluru',
      durationDays: 4,
      selectedDistricts: ['kodagu', 'dakshina-kannada'],
      selectedDistrictNames: ['Kodagu', 'Dakshina Kannada'],
      interests: ['Nature', 'Beaches'],
      transport: 'Own Car',
      budgetTier: 'Moderate',
      travelersCount: 2,
      coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      days: [],
      waypoints: [],
      budgetEstimate: { total: 18000, breakdown: { stay: 8000, food: 4000, transport: 4000, activities: 2000 } },
      essentialsToCarry: ['Camera', 'Raincoat'],
      seasonalTips: ['Monsoons are lush'],
      isCustomSaved: true,
    };

    const saveRes = await request('POST', '/api/trips', persistentTripPayload, authToken);
    assert(saveRes.status === 201, 'Direct trip save returns HTTP 201');

    const dbPersistentCheck = await query('SELECT id, title, user_id FROM trips WHERE id = $1', [persistentTripPayload.id]);
    assert(dbPersistentCheck.rows.length === 1, 'Trip is directly verified in Neon database');
    assert(dbPersistentCheck.rows[0]?.title === 'Persistent Western Ghats Explorer', 'Persisted trip title matches in DB');

    console.log('\n========================================================');
    console.log(`🏁 VERIFICATION COMPLETE: ${passed} Passed, ${failed} Failed`);
    console.log('========================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err: any) {
    console.error('💥 Test suite crashed with error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runVerification();
