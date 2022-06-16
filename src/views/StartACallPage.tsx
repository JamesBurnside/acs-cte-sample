import React, { useState } from 'react';
import { PageWithHeader } from './PageWithHeader';
import { mergeStyles, PrimaryButton, Stack, Text, TextField } from '@fluentui/react';

export const StartACallPage = (props: {
  joinTeamsMeeting: (meetingUrl: string) => void;
}) => {
  const [url, setUrl] = useState<string>();

  return (
    <PageWithHeader>
      <Stack tokens={{ childrenGap: '2rem'}}>
        <Stack.Item>
          <Text role={'heading'} aria-level={1} className={headerStyle}>
            {'Join a Teams Meeting'}
          </Text>
        </Stack.Item>
        <Stack.Item>
          <TextField onChange={(_, newValue) => setUrl(newValue)} label="Enter Teams URL " required placeholder='https://...' />
        </Stack.Item>
        <Stack.Item>
          <PrimaryButton disabled={!url} onClick={() => url && props.joinTeamsMeeting(url) }>Join Meeting</PrimaryButton>
        </Stack.Item>
      </Stack>
    </PageWithHeader>
  );
}

const headerStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '2rem'
});
