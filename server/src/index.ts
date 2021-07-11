import App from './App';

import './config';

(async () => {
  const app = new App();

  app.start();

  app.open();
})();
