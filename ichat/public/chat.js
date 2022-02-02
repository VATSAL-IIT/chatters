const frontendio = io.connect('http://localhost:4000');
const socket = io();
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
})
function sendMessage() {
    
    console.log(messageInput.value);
    const data = {
        name: nameInput.value,
        msg: messageInput.value,
        date: new Date(),
        time: new Date().getTime()
    }
    if(data.msg=="")
    return;
    socket.emit('message', data); 
                   //sending the data to server
    addMessageToUI(true,data);
    messageInput.value="";
}

socket.on('chat-message',(data)=>{
      console.log(data);
      addMessageToUI(false,data);
      
})
socket.on('clients-total',(data)=>{
    
    var clientsTotal=document.getElementById('clients-total');
    clientsTotal.innerHTML=`Total Clients ${data}`
})
function addMessageToUI(isOwnMessage, data) {
   
        const element = `<li class="${isOwnMessage?"message-right":"message-left"}">
        <p class="message">
            ${data.msg}
            <span>${data.name} ${data.date} ${data.time}</span>
        </p>
    </li>`
    
    messageContainer.innerHTML+=element;
    scrollToBottom();
}


function scrollToBottom()                                               //for auto scrolling to bottom effect after each message is sent or received.
{ 
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}