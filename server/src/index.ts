import 'module-alias/register';
import './config';

import App from '@App';

const app = new App();

(async () => {
  app.init();
  app.start();
  app.open();
})();

export default app;
