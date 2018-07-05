$( document ).ready( () => {
    var socket = io.connect('http://localhost:7777');
    socket.on('connected', function (msg) {
        console.log(msg);
        socket.emit('receiveHistory');
    });

    socket.on('message', addMessage);

    socket.on('history', messages => {
        for (let message of messages) {
            addMessage(message);
        }
    });

    $('.chat-message button').on('click', e => {
        e.preventDefault();

        var selector = $("textarea[name='message']");
        var messageContent = selector.val().trim();
        if(messageContent !== '') {
            socket.emit('msg', messageContent);
            selector.val('');
            $(".chat-history").animate({ scrollTop: $('.chat-history')[0].scrollHeight}, 1000);
        }
    });
    function encodeHTML (str){
        return $('<div />').text(str).html();
    }
    function addMessage(message) {
        message.date      = (new Date(message.date)).toLocaleString();
        message.username  = encodeHTML(message.username);
        message.content   = encodeHTML(message.content);

        var html = `
            <div class="single-message">
                <div class="message-data">
                    <span class="message-data-name">${message.username}</span>
                    <span class="message-data-time">${message.date}</span>
                </div>
                <div class="my-message" dir="auto">${message.content}</div>
            </div>`;

        $(html).hide().appendTo('.chat-history').slideDown(200);
    }
});