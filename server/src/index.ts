import App from './App';

import './config';


const app = new App();

(async () => {
  app.start();

  app.open();
})();

export default app
