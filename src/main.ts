import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment.prod';
import {register as registerSwiperElements} from 'swiper/element/bundle'

if (environment.production) {
  enableProdMode();
}
registerSwiperElements();
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
