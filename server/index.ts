import * as http from 'http';
import * as express from 'express';
import * as RED from 'node-red';

// Create an Express app
let app = express();

// Add a simple route for static content served from 'public'
app.use('/', express.static('public'));

// Create a server
let server = http.createServer(app);

// Create the settings object - see default settings.js file for other options
let settings = {
  httpAdminRoot: '/red',
  httpNodeRoot: '/api',
  uiPort: 4000,
  uiHost: 'localhost',
  userDir: './',
  // adminAuth: {
  //   type: '"credentials"',
  //   users: [
  //     {
  //       username: 'string',
  //       password: 'string',
  //       permissions: '*',
  //     },
  //   ],
  //  },

  functionGlobalContext: {}, // enables global context
};

// Initialise the runtime with a server and settings
RED.init(server, settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot, RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot, RED.httpNode);

server.listen(4000);

// Start the runtime
RED.start();
