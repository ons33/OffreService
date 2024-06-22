// config/keycloak-config.js

import session from 'express-session';
import Keycloak from 'keycloak-connect';

let _keycloak;

const keycloakConfig = {
  clientId: 'espritookService',
  bearerOnly: false,
  serverUrl: 'http://localhost:8080/auth',
  realm: 'Esprit',
  credentials: {
    grantType: 'client_credentials',
        clientId: 'espritookService',
    secret: '41d0e3d6-325e-49d3-af44-dc341555af1e',
  },
};

function initKeycloak() {
  if (_keycloak) {
    console.warn('Trying to init Keycloak again!');
    return _keycloak;
  } else {
    console.log('Initializing Keycloak...');
    const memoryStore = new session.MemoryStore();
    _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
    return _keycloak;
  }
}

function getKeycloak() {
  if (!_keycloak) {
    console.error('Keycloak has not been initialized. Please call initKeycloak first.');
  }
  return _keycloak;
}

export { initKeycloak, getKeycloak };
