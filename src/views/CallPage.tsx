import { CallWithChatAdapter, CallWithChatComposite } from '@azure/communication-react';
import React from 'react';
import { PageWithHeader } from './PageWithHeader';

export const CallPage = (props: {adapter: CallWithChatAdapter}) => {
  return (
    <PageWithHeader>
      <CallWithChatComposite adapter={props.adapter} />
    </PageWithHeader>
  );
}
