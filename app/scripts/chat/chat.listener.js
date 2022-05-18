import browser from 'webextension-polyfill';
import {
  wakuReadMessages,
  wakuSubscribeToSubtopic,
} from '../../../ui/pages/chat/chat.utils';

export const CHAT_NOTIFICATION_ID = 'chat-notification';
const CHAT_LISTENER_POLL_INTERVAL = 5000;
const CHAT_HOME_URL = 'home.html#chat';

function getExtensionTabs() {
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
    const extensionTabs = await getExtensionTabs();
    if (extensionTabs?.length) {
      const chatTab = extensionTabs.find((tab) => tab.url.includes(url));
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
    const extensionTabs = await browser.extension.getViews({ type: 'tab' });
    if (extensionTabs?.length) {
      const chatTab = extensionTabs.find(
        (tab) =>
          tab.location.href.includes(url) &&
          // tab is visible
          !tab.document.hidden,
      );
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
  if (chatTabId) {
    browser.tabs.update(chatTabId, { active: true });
  } else {
    browser.tabs.create({ url: CHAT_HOME_URL });
  }
}

export default function chatListener(selectedAddress) {
  console.log('starting chat listener....');
  // TODO - auto-subscription is just for the demo
  let subscribedToMMTopic = false;

  async function sendChatNotification() {
    browser.notifications.create(CHAT_NOTIFICATION_ID, {
      type: 'basic',
      title: 'New message in MetaMask group',
      message: 'Somebody has just left a message in the group',
      priority: 2,
      iconUrl: browser.runtime.getURL('../../images/icon-64.png'),
    });
  }

  async function listenToNewChatMessages() {
    // TODO - auto-subscription is just for the demo
    if (!subscribedToMMTopic) {
      await wakuSubscribeToSubtopic();
      subscribedToMMTopic = true;
    }

    // Check to see if chat tab is already open and is in focus
    const chatTabExists = await checkTabExists(CHAT_HOME_URL);
    if (!chatTabExists) {
      try {
        // Fetch new chat messages
        const resp = await wakuReadMessages();
        if (resp?.result?.length) {
          // Notify user of new message/s
          await sendChatNotification();
        }
      } catch (err) {
        console.log('error listening to new chat messages');
      }
    }
  }

  // Poll new chat messages
  setInterval(listenToNewChatMessages, CHAT_LISTENER_POLL_INTERVAL);
}
