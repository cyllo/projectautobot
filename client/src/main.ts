import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { polyfillLoader } from 'polyfill-io-feature-detection';
import * as WebFont from 'webfontloader';

// depending on the env mode, enable prod mode or add debugging modules
if (process.env.ENV === 'build') {
  enableProdMode();
}

function App () {
  // your app code here
  WebFont.load({
    google: {
      families: ['Roboto:300,400,500']
    }
  });
  return platformBrowserDynamic().bootstrapModule(AppModule);
}

export function main() {
  polyfillLoader({
    'features': 'Promise',
    'onCompleted': App
  });
}

if (document.readyState === 'complete') {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
