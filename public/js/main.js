const chatForm = document.getElementById('chat-form');
const chatMessagesDiv = document.querySelector('.chat-messages');
const socket = io();
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//get Username and room from url ---> from qs script

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
console.log(username, room);

//Join chatRoom

socket.emit('joinRoom', {
    username, room
});

//get room and users
socket.on('roomUsers', (room) => {
    outputRoomName(room);
    outputUsers(room.users);
})

//msg from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down every msg
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
})

//Message submit
chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = event.target.elements.msg.value;
    //Emitting msg to server
    socket.emit('chatMessage', message);
    event.target.elements.msg.value = '';
    event.target.elements.msg.focus();
})

const outputMessage = (chatMessage) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = ` <p class="meta">${chatMessage.username} <span>${chatMessage.time}</span></p>
    <p class="text">
     ${chatMessage.msgText}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

const outputRoomName = (roomObject) => {
    roomName.innerText = roomObject.room;
}
const outputUsers = (users) => {
    userList.innerHTML = `${users?.map(user => `<li>${user?.username}</li>`).join('')}`
}