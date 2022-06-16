import { Spinner, Stack } from '@fluentui/react';
import { User } from '@microsoft/microsoft-graph-types';
import React, { useEffect, useState } from 'react';
import { Providers } from '@microsoft/mgt-react';
import { useIsSignedIn } from './utils/useIsSignedIn';
import { StartACallPage } from './views/StartACallPage';
import { CallPage } from './views/CallPage';
import { WelcomePage } from './views/WelcomePage';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { CallWithChatAdapter } from '@azure/communication-react';

const connectionString = process.env['REACT_APP_AZURE_COMMUNICATION_SERVICES_RESOURCE_CONNECTION_STRING'];

const AppBody = (): JSX.Element => {
  const [callAdapter, setCallAdapter] = useState<CallWithChatAdapter>();
  const [meetingUrl, setMeetingUrl] = useState<string>();
  const [me, setMe] = useState<User>();
  const [isSignedIn] = useIsSignedIn();

  useEffect(() => {
    if (isSignedIn) {
      (async () => {
        setMe(await Providers.me());
      })();
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!meetingUrl) return;

    (async () => {
      const aadToken = await Providers.globalProvider.getAccessToken();
      if (!connectionString) throw new Error('No ACS resource connection string provided');
      const client = new CommunicationIdentityClient(connectionString);
      // const accessToken = await client.getTokenForTeamsUserAsync(aadToken);
      // setCallAdapter({});
    })();
  }, [meetingUrl])

  if (!isSignedIn) {
    return <WelcomePage />;
  }

  if (!me) {
    return <Spinner label="Fetching chat information from Microsoft Graph..." />;
  }

  if (!me.id) {
    return <>{'Unable to get your user id from graph 🤷'}</>;
  }
  if (!me.displayName) {
    return <>{'Unable to get your displayName from graph 🤷'}</>;
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
