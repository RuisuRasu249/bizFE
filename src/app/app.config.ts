import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

/**
 * The main application configuration.
 * This configuration sets up essential providers such as routing, HTTP client, and optimized zone change detection.
 */

export const appConfig: ApplicationConfig = {
   /**
   * Array of providers used to configure the application.
   * 
   * - `provideZoneChangeDetection`: Configures Angular's zone change detection with event coalescing enabled
   *   to optimize performance by batching multiple events into a single change detection cycle.
   * 
   * - `provideRouter`: Provides the application's routing configuration using the routes defined in `app.routes`.
   * 
   * - `provideHttpClient`: Provides Angular's HttpClient for making HTTP requests.
   */
  providers: [
    /**
     * Configures Angular's zone change detection.
     * 
     * @property eventCoalescing - If `true`, enables event coalescing, reducing the number of change detection cycles triggered by DOM events.
     */
    provideZoneChangeDetection({ eventCoalescing: true }), 
    /**
     * Sets up the application's router with the defined routes.
     * 
     * @param routes - The array of route definitions imported from `app.routes`.
     */
    provideRouter(routes),
    /**
     * Provides the HttpClient module to enable HTTP communication.
     */
    provideHttpClient()
  ]
};
