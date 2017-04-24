let socket;

function init(url) {
  socket = new WebSocket(url);
  console.log('connecting...');
}

function registerOpenHandler(handlerFunction) {
  socket.onopen = () => {
    console.log('open');
    handlerFunction();
  };
}

function registerMessageHandler(handlerFunction) {
  socket.onmessage = (e) => {
    console.log('message', e.data);
    let data = JSON.parse(e.data);   //convert JSON string to a javascript obj
    handlerFunction(data);
  };
}

function sendMessage(payLoad) {
  socket.send(JSON.stringify(payLoad)); //turn 'payLoad' message (containing the msg, username, time) into JSON string.
}                                       //then send JSON string to WebSocket server

export default {
  init,
  registerOpenHandler,
  registerMessageHandler,
  sendMessage
}
