import { Spinner, Stack } from '@fluentui/react';
import { User } from '@microsoft/microsoft-graph-types';
import React, { useEffect, useState } from 'react';
import { Providers } from '@microsoft/mgt-react';
import { useIsSignedIn } from './utils/useIsSignedIn';
import { StartACallPage } from './views/StartACallPage';
import { CallPage } from './views/CallPage';
import { WelcomePage } from './views/WelcomePage';

const AppBody = (): JSX.Element => {
  const [callAdapter, setCallAdapter] = useState<unknown>();
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
    setCallAdapter(meetingUrl); // todo construct call adapter here.
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
      <CallPage />
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
