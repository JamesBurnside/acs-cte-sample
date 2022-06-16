import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Providers } from '@microsoft/mgt-element';
import { Msal2Provider } from '@microsoft/mgt-msal2-provider';

Providers.globalProvider = new Msal2Provider({
  clientId: 'a2ee26d1-a1e2-4289-b37b-1da484a72fb8',
  scopes: ['User.Read', 'https://auth.msft.communication.azure.com/Teams.ManageCalls']
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

