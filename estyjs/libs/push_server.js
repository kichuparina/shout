

var isConnectedToPushServer = false;
var signalRServer;

var signlRConnection;

var chat;










//periodicRefresh method is called when client takes time to connect to signalr.
var periodicRefresh;

function SignalRInit()
{
    $.connection.hub.logging = true;
    chat = $.connection.chatHub;
    $.connection.hub.url = 'http://localhost:61/signalr';



    chat.client.push = function (message) {
        console.log(message);
        pushLogic(message);
    };





    $.connection.hub.start({ transport: ['webSockets', 'longPolling', 'foreverFrame', 'serverSentEvents'] });



    var tryingToReconnect = false;
    $.connection.hub.reconnecting(function () {
        console.log("reconnecting");
        tryingToReconnect = true;
    });

    $.connection.hub.reconnected(function () {
        console.log("reconnected");
        tryingToReconnect = false;
    });




   
    function signalRStart() {


        $.connection.hub.start({ jsonp: true }).done(function () {
            $('#sendmessage').click(function () {
                // Call the Send method on the hub.
                chat.server.send($('#displayname').val(), $('#message').val());
                // Clear text box and reset focus for next comment.
                $('#message').val('').focus();
            });



            signalRServer = chat.server;

            //        let isBrowserSupportWebRtc = isWebRtcSupport();

            //if (isBrowserSupportWebRtc) {
            //    pageReady(function (cliendid, data) {


            //        console.log("sending signal r: " + data);
            //        chat.server.peer(cliendid, data);
            //    });
            //}
            //else {
            //    $('#videoCallButton').prop("disabled", true);
            //}
            //Client code that displays the transport method used by a connection
            console.log("transport: " + $.connection.hub.transport.name);

            //ConnectionID ID
            var connectionID = $.connection.hub.id;
            console.log("connection ID: " + connectionID);


            localStorage.setItem('connectionID', connectionID);
            //save token to db  /js/chat/setPushToken



            setPushToken(connectionID);




            isConnectedToPushServer = true;




            //stop timer. Now user connectd to push server
            clearTimeout(periodicRefresh);
            //  alert("hello rezwan vai");
            ///  chat.server.send( "hello rezwan vai");


        }).fail(function () {
            isConnectedToPushServer = false;
            console.log('Could not connect to signalr!');

            periodicRefresh = setTimeout(function () {

                //get data form server using periodic ajax call
                //write your ajax call for getting data
                console.log("timer call....s");

            }, 3000);

        });
    }
    signalRStart();

  




    $.connection.hub.connectionSlow(function () {
        console.log("connectionSlow...");
    });



    $.connection.hub.disconnected(function () {
        console.log("disconnect");
        isConnectedToPushServer = false;
        if (tryingToReconnect) {
            console.log('notify user');
        }
        setTimeout(function () {
            // start();
        }, 5000);

    });






    function pushLogic(json) {


        var json = JSON.parse(json);
        var id = parseInt(json.id); //id
        var type = parseInt(json.t); //type
        var account_id = parseInt(json.aid); //accountid
        var message = json.data //messag
        let pathName = window.location.pathname.toLocaleLowerCase().replace('/', '');




        if ((type >= 40 && type <= 50)) {
            playMessageSound();
            e('#notification_count').show();
            let _count = parseInt(e('#notification_count').val());
            e('#notification_count').val(++_count)
            apiCall.makeNotificaitonSeen(id);
        } else {

            switch (type) {
                case 1:
                    playMessageSound();
                    apiCall.getSingleChat(id);

                    break
                case 13: //delivered
                    //playMessageSound();
                    //apiCall.getSingleChat(id);

                    if (pathName == "chat") {
                        e('#img_' + id).getObject(0).setAttribute('src', 'http://192.168.2.24:61/Content/images/icon/delivered.png');
                    }

                    break
                case 15: //seend
                    //playMessageSound();
                    //apiCall.getSingleChat(id)
                    if (pathName == "chat") {
                        e('#img_' + id).getObject(0).setAttribute('src', 'http://192.168.2.24:61/Content/images/icon/seen.png');
                    }
                    break
            }
        }


    }
    function playMessageSound() {

        var audio = new Audio('resource/audio/message.mp3');
        audio.play();

    }
    function setPushToken(connid) {
        var token = localStorage.getItem('access_token');
        new HttpRequest(host + '/api/accesstoken/settoken?access_token=' + connid, function () { }, token).getRequest(function (json) {
            console.log('set token: ' + json.flag);
        });


    }
}







SignalRInit();