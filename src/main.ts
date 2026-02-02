import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from './environments/environments';

const app = initializeApp(environment.firebase);
const db = getFirestore(app);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
