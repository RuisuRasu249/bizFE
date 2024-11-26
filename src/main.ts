import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideHttpClient } from '@angular/common/http';

  
  bootstrapApplication(AppComponent, {
    providers: [
      provideAuth0({
        domain: 'dev-ktpz2u60xc4rbl3m.us.auth0.com',
        clientId: '4gJTjcnXHiRCtM2JWBb2mWseggbfklQM',
        authorizationParams: {
          redirect_uri: window.location.origin
        }
      }),
      provideHttpClient(),
      appConfig.providers
    ]
}).catch((err) => console.error(err));