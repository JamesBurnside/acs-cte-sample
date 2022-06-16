import { Spinner, Stack } from '@fluentui/react';
import { User } from '@microsoft/microsoft-graph-types';
import React, { useEffect, useState } from 'react';
import { Providers } from '@microsoft/mgt-react';
import { useIsSignedIn } from './utils/useIsSignedIn';
import { StartACallPage } from './views/StartACallPage';
import { CallPage } from './views/CallPage';
import { WelcomePage } from './views/WelcomePage';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { createAzureCommunicationCallWithChatAdapter, CallWithChatAdapter } from '@azure/communication-react';
import { AzureCommunicationTokenCredential, parseConnectionString } from '@azure/communication-common';

const connectionString = process.env['REACT_APP_AZURE_COMMUNICATION_SERVICES_RESOURCE_CONNECTION_STRING'];

const AppBody = (): JSX.Element => {
  const [callAdapter, setCallAdapter] = useState<CallWithChatAdapter>();
  const [meetingUrl, setMeetingUrl] = useState<string>();
  const [me, setMe] = useState<User>();
  const [isSignedIn] = useIsSignedIn();
  const [error, setError] = useState<string | undefined>(connectionString ? undefined : 'No ACS resource connection string provided.');

  useEffect(() => {
    if (isSignedIn) {
      (async () => {
        const me = await Providers.me();
        if (!me.displayName) {
          setError('Unable to get your displayName from graph 🤷');
          return;
        }

        setMe(me);
      })();
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!meetingUrl || !me) return;

    (async () => {
      const aadId = me.id;
      if (!aadId) {
        setError('Unable to get your user id from the graph provider');
        return;
      }

      let aadToken;
      try {
        aadToken = await Providers.globalProvider.getAccessTokenForScopes('https://auth.msft.communication.azure.com/Teams.ManageCalls');
      } catch (e) {
        console.error(e);
      }
      if (!aadToken) {
        setError('Failed to get your aadToken with Teams.ManageCalls scope.');
        return;
      }

      let client;
      try {
        client = new CommunicationIdentityClient(connectionString!);
      } catch (e) {
        console.error(e);
      }
      if (!client) {
        setError('Failed to create CommunicationIdentityClient from the provided resource connection string.');
        return;
      }

      let acsToken;
      try {
        acsToken = await client.getTokenForTeamsUser(aadToken);
      } catch (e) {
        console.error(e);
      }
      if (!acsToken?.token) {
        setError('Failed to acquire an ACS token.');
        return;
      }

      let callAdapter;
      try {
        callAdapter = await createAzureCommunicationCallWithChatAdapter({
          endpoint: parseConnectionString(connectionString!).endpoint,
          userId: { communicationUserId: aadId },
          displayName: undefined as any,
          credential: new AzureCommunicationTokenCredential(acsToken.token),
          locator: { meetingLink: meetingUrl }
        });
        setCallAdapter(callAdapter);
      } catch (e) {
        console.error(e);
      }
      if (!callAdapter) {
        setError('Failed to create AzureCommunicationCallWithChatAdapter.');
        return;
      }
    })();
  }, [me, meetingUrl]);

  if (error) {
    return <>{`⚠️ ERROR: ${error}`}</>;
  }

  if (!isSignedIn) {
    return <WelcomePage />;
  }

  if (!me) {
    return <Spinner label="Fetching chat information from Microsoft Graph..." />;
  }

  if (!meetingUrl) {
    return <StartACallPage joinTeamsMeeting={(url) => { setMeetingUrl(url) }} />;
  }

  if (!callAdapter) {
    return <Spinner label="Getting ready to join meeting" />;
  }

  if (meetingUrl) {
    return (
      <CallPage adapter={callAdapter} />
    );
  }

  return <>{'Invalid App Page.. Not sure how you got here.. file a github issue about this.'}</>;
}

function App() {
  return (
    <Stack verticalFill verticalAlign='center' horizontalAlign='center'>
      <AppBody />
    </Stack>
  );
}

export default App;
