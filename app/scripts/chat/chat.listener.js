import browser from 'webextension-polyfill';
import {
  wakuReadMessages,
  wakuSubscribeToSubtopic,
} from '../../../ui/pages/chat/chat.utils';

export const CHAT_NOTIFICATION_ID = 'chat-notification';
const CHAT_LISTENER_POLL_INTERVAL = 2000;

export async function isChatPageHidden() {
  try {
    const [activeTab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const { url } = activeTab;
    return (
      !url ||
      url.indexOf('chrome-extension://') === -1 ||
      url.indexOf('home.html#chat') === -1
    );
  } catch (err) {
    return true;
  }
}

export default function chatListener(selectedAddress) {
  console.log('starting chat listener....');

  async function notifyNewChatMessages() {
    // Fetch new messages
    const resp = await wakuReadMessages();
    if (resp?.result?.length) {
      const chatPageHidden = await isChatPageHidden();

      if (chatPageHidden) {
        // Notify user of new messages in the group
        browser.notifications.create(CHAT_NOTIFICATION_ID, {
          type: 'progress',
          progress: 100,
          title: 'New message in MetaMask chat',
          message: 'Somebody has just messaged the group',
          priority: 2,
          iconUrl: browser.runtime.getURL('../../images/icon-64.png'),
        });
      }
    }
  }

  // Poll new chat messages
  setInterval(notifyNewChatMessages, CHAT_LISTENER_POLL_INTERVAL);
}
