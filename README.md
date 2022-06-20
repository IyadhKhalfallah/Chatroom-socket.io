# Chatroom Socket.io POC
This project was released using the following technologies:
- Node.js
- Express API
- MongoDB
- Mongoose
- Socket.io
- React
- Cypress (end-to-end UI testing)
- Docker / Docker-compose

### 1. Sign In / Sign Up:
In his part of the project, JWT was used to handle the user's session as well as password hashing for more security. <br/>

### 2. Create Room / Join Room:
The user can create a room. A room ID will be generated to be copied by other users in order to join a room. <br/>
The user can join a room by entering an ID given by another user. <br/>
A list of user IDs joined by the user is available in the homepage, with an indicator on how many users there are in each room.  

### 3. Messaging:
Real-time messaging is available in each room, where users can send / receive messages instantly. Added to that, a messaging history is available so that the messages are persisted in each room.  

### 4. App screenshots
![Alt text](./images/sign-in.png?raw=true "Sign In")
![Alt text](./images/home.png?raw=true "Homepage")
![Alt text](./images/chat.png?raw=true "Chatroom")