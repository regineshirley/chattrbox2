import socket from './ws-client';
import {UserStore} from './storage';
import {ChatForm, ChatList, promptForUsername} from './dom';     //{} = named import. declares a local variable named ChatForm
                                    //binds it to the value from the dom module
const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]';
const LIST_SELECTOR = '[data-chat="message-list"]';

let userStore = new UserStore('x-chattrbox/u');
let username = userStore.get();
if (!username) {
  username = promptForUsername();
  userStore.set(username);
}

class ChatApp {
  constructor() {
    this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
    this.chatList = new ChatList(LIST_SELECTOR, username);

    socket.init('ws://localhost:3001');   //opens socket connection to the server
    socket.registerOpenHandler(() => {    //opening a connection
      this.chatForm.init((text) => {      //when it's open, initializes instace of ChatForm
        let message = new ChatMessage({message: text});    //package up msg as ChatMessage
        socket.sendMessage(message.serialize());    //sends msg data from ChatForm to WebSockets server
      });
      this.chatList.init();
    });
    socket.registerMessageHandler((data) => {
      console.log(data);       //when msg is received you log into the console
      let message = new ChatMessage(data);    //create a new ChatMessage using the incoming data
      this.chatList.drawMessage(message.serialize());   //serialize the message
    });
  }
}

class ChatMessage {
  constructor({
    message: m,
    user: u= username,
    timestamp: t=(new Date()).getTime()
  }) {
    this.message = m;
    this.user = u;
    this.timestamp = t;
  }
  serialize() {
    return {
      user: this.user,
      message: this.message,
      timestamp: this.timestamp
    };
  }
}
export default ChatApp;
