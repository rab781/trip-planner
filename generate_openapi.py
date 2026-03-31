import re

routes = """
Route::get('/cities', [CityController::class, 'index']);
Route::get('/cities/{id}', [CityController::class, 'show']);
Route::get('/cities/{id}/zones', [ItineraryController::class, 'zones']);

Route::get('/zones',[ZoneController::class, 'index']);
Route::get('/zones/{id}', [ZoneController::class, 'show']);
Route::get('/zones/{id}/destination', [TransportRateController::class, 'destination']);

Route::get('/categories',[CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/{id}', [DestinationController::class, 'show']);

Route::get('/transport-rates', [TransportRateController::class, 'index']);

// Chatbot AI routes - public access with rate limiting
Route::post('/chat', [ChatController::class, 'sendMessage']);
Route::post('/chat/stream', [ChatController::class, 'sendMessageStream']);

// Protected API routes - require authentication
Route::get('/itineraries', [ItineraryController::class, 'index']);
Route::post('/itineraries', [ItineraryController::class, 'store']);
Route::get('/itineraries/{id}', [ItineraryController::class, 'show']);
Route::put('/itineraries/{id}', [ItineraryController::class, 'update']);
Route::delete('/itineraries/{id}', [ItineraryController::class, 'destroy']);

Route::put('/itineraries/{id}/reorder', [ItineraryController::class, 'reorder']);
Route::put('/itineraries/{id}/sync-items', [ItineraryController::class, 'syncItems']);

Route::post('/itineraries/generate', [ItineraryController::class, 'generate']);
Route::post('/itineraries/regenerate-day', [ItineraryController::class, 'regenerateDay']);
Route::post('/itineraries/suggest-replacement', [ItineraryController::class, 'suggestReplacement']);

// ADMIN API (Protected)
Route::get('/admin/stats', [DashboardController::class, 'stats']);

// apiResource destinations
Route::get('/admin/destinations', AdminDestinationController::class);
Route::post('/admin/destinations', AdminDestinationController::class);
Route::get('/admin/destinations/{id}', AdminDestinationController::class);
Route::put('/admin/destinations/{id}', AdminDestinationController::class);
Route::delete('/admin/destinations/{id}', AdminDestinationController::class);

Route::get('/admin/users', [AdminUserController::class, 'index']);
Route::patch('/admin/users/{id}/role', [AdminUserController::class, 'updateRole']);

// apiResource categories
Route::get('/admin/categories', AdminCategoryController::class);
Route::post('/admin/categories', AdminCategoryController::class);
Route::get('/admin/categories/{id}', AdminCategoryController::class);
Route::put('/admin/categories/{id}', AdminCategoryController::class);
Route::delete('/admin/categories/{id}', AdminCategoryController::class);

// apiResource zones
Route::get('/admin/zones', AdminZoneController::class);
Route::post('/admin/zones', AdminZoneController::class);
Route::get('/admin/zones/{id}', AdminZoneController::class);
Route::put('/admin/zones/{id}', AdminZoneController::class);
Route::delete('/admin/zones/{id}', AdminZoneController::class);
"""

import yaml

openapi = {
    "openapi": "3.1.0",
    "info": {
        "title": "Itinerary Management System API",
        "version": "1.0.0",
        "description": "The Itinerary Management System API allows you to retrieve destinations, manage itineraries, and use AI-powered trip generation."
    },
    "servers": [
        {
            "url": "/api",
            "description": "API Base Path"
        }
    ],
    "components": {
        "securitySchemes": {
            "bearerAuth": {
                "type": "http",
                "scheme": "bearer"
            }
        }
    },
    "paths": {}
}

for line in routes.split('\n'):
    line = line.strip()
    if not line.startswith('Route::'): continue
    match = re.search(r"Route::(get|post|put|patch|delete)\('([^']+)'", line)
    if not match: continue
    method = match.group(1).lower()
    path = match.group(2)

    if path not in openapi['paths']:
        openapi['paths'][path] = {}

    operation = {
        "summary": f"{method.upper()} {path}",
        "responses": {
            "200": {
                "description": "Success"
            }
        }
    }

    # check for parameters
    params = re.findall(r'\{([^}]+)\}', path)
    if params:
        operation['parameters'] = []
        for p in params:
            operation['parameters'].append({
                "name": p,
                "in": "path",
                "required": True,
                "schema": {
                    "type": "string"
                }
            })

    if '/admin' in path or '/itineraries' in path:
        operation['security'] = [{"bearerAuth": []}]

    openapi['paths'][path][method] = operation

with open('openapi.yml', 'w') as f:
    yaml.dump(openapi, f, sort_keys=False)
