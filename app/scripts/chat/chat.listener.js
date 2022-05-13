import browser from 'webextension-polyfill';
import {
  wakuReadMessages,
  wakuSubscribeToSubtopic,
} from '../../../ui/pages/chat/chat.utils';

export const CHAT_NOTIFICATION_ID = 'chat-notification';
const CHAT_LISTENER_POLL_INTERVAL = 2000;
const CHAT_HOME_URL = 'home.html#chat';

function getOwnTabs() {
  return Promise.all(
    browser.extension
      .getViews({ type: 'tab' })
      .map(
        (view) =>
          new Promise((resolve) =>
            view.chrome.tabs.getCurrent((tab) =>
              resolve(Object.assign(tab, { url: view.location.href })),
            ),
          ),
      ),
  );
}

async function getActiveTabId(url) {
  try {
    const ownTabs = await getOwnTabs();
    if (ownTabs?.length) {
      const chatTab = ownTabs.find((tab) => tab.url.includes(url));
      console.log('got chat for open', chatTab);
      if (chatTab) {
        return chatTab.id;
      }
    }
    return null;
  } catch (err) {
    return null;
  }
}

async function checkTabExists(url) {
  try {
    const ownTabs = await browser.extension.getViews({ type: 'tab' });

    if (ownTabs?.length) {
      const chatTab = ownTabs.find(
        (newTab) =>
          newTab.location.href.includes(url) && !newTab.document.hidden,
      );

      console.log('got chatTbals', chatTab);
      if (chatTab) {
        return true;
      }
    }
    return false;
  } catch (err) {
    return false;
  }
}

export async function openChatTab() {
  const chatTabId = await getActiveTabId(CHAT_HOME_URL);
  console.log('chatTabId', chatTabId);
  if (chatTabId) {
    browser.tabs.update(chatTabId, { active: true });
  } else {
    browser.tabs.create({ url: CHAT_HOME_URL });
  }
}

export default function chatListener(selectedAddress) {
  console.log('starting chat listener....');

  function sendChatNotification() {
    browser.notifications.create(CHAT_NOTIFICATION_ID, {
      type: 'progress',
      progress: 100,
      title: 'New message in MetaMask chat',
      message: 'Somebody has just messaged the group',
      priority: 2,
      iconUrl: browser.runtime.getURL('../../images/icon-64.png'),
    });
  }

  async function listenToNewChatMessages() {
    // Fetch new messages
    try {
      const resp = await wakuReadMessages();
      if (resp?.result?.length) {
        const chatTabExists = await checkTabExists(CHAT_HOME_URL); // force active check
        if (!chatTabExists) {
          // Notify user of new message/s
          sendChatNotification();
        }
      }
    } catch (err) {
      console.log('error listening to new chat messages');
    }
  }

  // Poll new chat messages
  setInterval(listenToNewChatMessages, CHAT_LISTENER_POLL_INTERVAL);
}
