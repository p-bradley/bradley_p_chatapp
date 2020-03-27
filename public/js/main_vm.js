import ChatMessage from "./modules/ChatMessage.js";
const socket = io();

function setUserId({sID}){

    console.log(sID);
    vm.socketID = sID;
}

function showDisconnectMessage(){
    console.log('a user disconnected');
}

function appendMessage(message){
    vm.messages.push(message);
}

const vm = new Vue({
    data:{

        socketID: "",
        message: "",
        nickname: "",
        messages:[],
        typing: false,
    },

    watch: {
        message(value) {
            value ? socket.emit('typing', this.nickname) : socket.emit('stoptyping');
        }
    },
    
      created() {
         socket.on('typing', (data) => {
             console.log(data);
             this.typing = data || 'anonymous';
             
         });
         socket.on('stoptyping', () => {
             this.typing = false;
         });
      },

    methods:{
        dispatchMessage(){
            console.log('handle emit message');

        //When a chat message is sent, displays what the user types as well as a nickname
        //If the user doesnt have a nickname, sets it to anonymous
        if (this.message != "") {
            socket.emit('chat_message', {
                content: this.message,
                name: this.nickname || 'anonymous',
                sent:  new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
            });

            //after a message is sent, clear out the text area
            this.message = "";
        } 
        },
        isTyping() {
            socket.emit('typing', this.nickname);
        },

    },
    mounted(){
        console.log('vue is done mounting');
    },

    components:{
        newmessage:ChatMessage
    }
}).$mount("#app");

socket.addEventListener('connected', setUserId);
socket.addEventListener('disconnect', showDisconnectMessage);
socket.addEventListener('new_message', appendMessage);