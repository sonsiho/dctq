import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initializeFirebaseAnalytics } from './app/firebase';

void initializeFirebaseAnalytics();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
