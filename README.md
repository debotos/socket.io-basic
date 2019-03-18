# WebSocket

## Characteristics:
- ***WebSocket allow for full-duplex communication(both way or bi-directional communication)***
- ***WebSocket is a separate protocol from HTTP***
- ***Persistent connection between client and server***

### Note:
***SocketIO expects it to be called with the raw HTTP Server. But it's not possible with express because express also does that but under the hood. That's why all these thing...***

    const  http  =  require('http');
    const  express  =  require('express');
    const  socketio  =  require('socket.io');

    const  app  =  express();  // 1. create express app
    const  server  = http.createServer(app);  // 2. put express app inside httpServer
    const  io  =  socketio(server)  // 3. put httpServer inside SocketIO


### 3 ways via the server can emit event

**socket.emit()**;                     This emit event for ***current client(particular)***

**io.emit();**                             This emit event for ***all client including current***

**socket.broadcast.emit()**   This emit event for ***all client except current one***

### Built-in Events

**io**.on('**connection**') // Used for new connection(Note that io.on(<built in event>))
    
**socket**.on('**disconnect**') // Run whenever a client gets disconnected

### Event Acknowledgement

Via acknowledgement the client would ***get notified that the message(content) delivered successfully.***
Simply, the client would get notified that the server processed the content that begin sent.
It can be ***reverse*** means server would get notified if the message delivered successfully to client.
It's just a matter of **setting callback in server or client emited event**.

***server(emit) -> client(receive) --acknowledgement--> server***

***client(emit) -> server(receive) --acknowledgement--> Client***

It provided via 3rd argument of emit() like,

**emit(nameOfTheEvent, data, acknowledgementFunction)**

It accessed via 2nd argunent of on() callback like,

**on(nameOfTheEvent, (data, acknowledgementFunction) => { acknowledgementFunction() })**

### In case of ROOM

-> `socket.join(room_name)`
It ***allows us to join a given chat room*** and we pass to the name of the room we're trying to join.

-> `io.to(room_name).emit(event_name, data)`
emits an event to ***everybody in a specific room***.

-> `socket.broadcast.to(room_name).emit(event_name, data)`
***similar to socket.broadcast.emit but it's for a specific room.***
