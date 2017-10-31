var host;
var headers;
var app;
var token;
document.addEventListener('DOMContentLoaded', function () {
    host = "http://192.168.2.24:61/";
    token = localStorage.getItem('access_token');
    var route = [
                { pageLocation: "livefeed.html", pageTitle: "Feed", displayUrl: 'livefeed', section: "#livefeed", isContentLoadingEverytime: false },
                { pageLocation: "chat.html", pageTitle: "Chat", displayUrl: 'chat', section: "#chat", isContentLoadingEverytime: true },
                { pageLocation: "profile.html", pageTitle: "profile", displayUrl: 'profile', section: "#profile", isContentLoadingEverytime: true },
                { pageLocation: "signin.html", pageTitle: "signin", displayUrl: 'signin', section: "#signin", isContentLoadingEverytime: true },
                { pageLocation: "signup.html", pageTitle: "signup", displayUrl: 'signup', section: "#signup", isContentLoadingEverytime: true },

                { pageLocation: "logout.html", pageTitle: "logout", displayUrl: 'logout', section: "#logout", isContentLoadingEverytime: true }
    ];

    app = new EstyJs();
    app.routes = route;






    app.onPageLoading = function (pageTitle, isAlreadyLoaded) {
        console.log(pageTitle + '   ' + isAlreadyLoaded);

        if (pageTitle == "signin") {
            var elems = document.getElementsByClassName('app-content');
            for (var i = 0; i < elems.length; i += 1) {
                elems[i].style.display = '';
            }

            document.getElementById('signinContainer').style.display = 'block';
            document.getElementById('signUpContainer').style.display = 'none';
        }
        else if (pageTitle == "signup") {


            var elems = document.getElementsByClassName('app-content');
            for (var i = 0; i < elems.length; i += 1) {
                elems[i].style.display = '';
            }

            document.getElementById('signUpContainer').style.display = 'block';
            document.getElementById('signinContainer').style.display = 'none';
        }
        else {
            document.getElementById('signinContainer').style.display = 'none';
            var elems = document.getElementsByClassName('app-content');
            for (var i = 0; i < elems.length; i += 1) {
                elems[i].style.display = 'block';
            }

        }


    }


    if (token == null) {
        let redirect = 'signin';

        if (app.getUrlDetails().pageName == "signin" || app.getUrlDetails().pageName == "signup") {
            redirect = app.getUrlDetails().pageName;
        }

        app.initPage(redirect);
    }
    else {


        app.initPage(app.getUrlDetails().pageName, app.getUrlDetails().queryString);
        apiCall.getChats();
        apiCall.getTodayNotification();



        //load push content
        loadJS('libs/jquery-1.10.2.min.js',false);      
        loadJS('libs/jquery.signalR-2.2.2.js', false);
        loadJS(host+'/signalr/hubs', false);
        loadJS('libs/push_server.js', false);
       
    }
    staticOntentEvent();



    e('.drawer').on("click", drawerClick);


    e('#notificationLink').on('click', notificationClick);

    document.addEventListener('click', function (evnt) {
        var el = evnt.target.closest('#notificationContainer');
        var drawer = evnt.target.closest('#side-bar');
        if (el) {
            // click inside the popu
        }
        else {

            // click outside the popup

            let IsShowing = e('#notificationContainer').getObject(0).getAttribute('IsShowing');

            if (IsShowing == "false") {

                e('#notificationContainer').getObject(0).setAttribute('IsShowing', 'false');
                e("#notificationContainer").hide();
            }
            else {
                e('#notificationContainer').getObject(0).setAttribute('IsShowing', 'false');
            }


        }

        if (!drawer) {


            if (e('#side-bar').getObject(0).getAttribute('IfDrawerEnable') == "true") {

                let IsShowingDrawer = e('#side-bar').getObject(0).getAttribute('IsShowing');

                e('#side-bar').getObject(0).setAttribute('IsShowing', false);

                if (IsShowingDrawer == "false") {

                    e("#side-bar").hide();
                }
            }

        }

    });

    e('#txtFindFriend').on("keyup", function () {
        apiCall.searchFriend(e('#txtFindFriend').val());

    });
    

});

function loadJS(file,isAsync) {
    // DOM: Create the script element
    var jsElm = document.createElement("script");
    // set the type attribute
    jsElm.type = "application/javascript";
    // make the script element load file
    jsElm.src = file;
    // finally insert the element to the body element in order to load the script
    jsElm.async = isAsync;
    document.body.appendChild(jsElm);
}
function displayMessage(message) {
   // alert(message);

    var x = document.getElementById("snackbar")
    x.className = "show";
    x.innerText = message;
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}
function notificationClick(evt) {

    e('#notificationContainer').getObject(0).setAttribute('IsShowing', 'true');
    let top = evt.pageY + 17 + "px";
    let left = evt.pageX - 10 + "px !important";
    e('#notificationContainer').show();

}
function drawerClick() {
    e('#side-bar').show();
    e('#side-bar').getObject(0).setAttribute('IsShowing', 'true');
    e('#side-bar').getObject(0).setAttribute('IfDrawerEnable', 'true');
}





function makeNotificaitonSeen(id) {

    var url = host + 'api/ApiPushNotification/makeseen?id=' + id;
    new HttpRequest(url, function () { }, headers).getRequest(function (json) {
        console.log("makeNotificaitonSeen: " + json.flag);
    });

}

function staticOntentEvent() {

    e('#lblContact').click(function (e) {
        apiCall.getChats();
    });
    e('#lblRequest').click(function (e) {
        apiCall.getFriendRequest();
    });
}








function closest(el, selector) {
    var matchesFn;

    // find vendor prefix
    ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function (fn) {
        if (typeof document.body[fn] == 'function') {
            matchesFn = fn;
            return true;
        }
        return false;
    })

    var parent;

    // traverse parents
    while (el) {
        parent = el.parentElement;
        if (parent && parent[matchesFn](selector)) {
            return parent;
        }
        el = parent;
    }

    return null;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
let apiCall = {

    getChats: function () {

        var token = localStorage.getItem('access_token');
        new HttpRequest(host + 'api/apifriend/getchats', function () { }, token).getRequest(function (json) {
            json.chats.forEach(function (obj) {
                if (obj.profile_picture === null) {
                    obj.profile_picture = 'resource/images/default/profile.svg';
                }
                else {

                    obj.profile_picture = host + obj.profile_picture + "&size=small";
                }

            });
            new Template(json.chats, 'chatsTemplate', 'chats').append();
            e('.friend').hide();
            e('#chats').show();

            e('.chatrow').on("click", function () {

                let account_id = this.getAttribute('data-id');
                let private_id = this.getAttribute('data-private-id');
                app.redirectPage("chat", "?id=" + account_id);
                e('#indicator_' + private_id).hide();


            });
        });
    },
    getTodayNotification: function () {

        var headers = localStorage.getItem('access_token');
        var url = host + 'api/ApiPushNotification/getFeedNotification?page=1';
        new HttpRequest(url, function () { }, headers).getRequest(function (json) {

            console.log("makeNotificaitonSeen: " + json);

            let totalUnseenCount = json.total_unseen;
            //$('#notification_count').text(totalUnseenCount);
            //if (totalUnseenCount > 0) {
            //    $('#notification_count').show();
            //}
            //$("#ntcContainer li").remove();



            json.notification.forEach(function (obj) {



                if (obj.account.profile_picture != null) {
                    obj.account.profile_picture = 'resource/images/default/profile.svg';
                }
                else {
                    obj.account.profile_picture = host + obj.account.profile_picture;
                }

                //  $("#notificationTemplate").tmpl(obj).appendTo("#ntcContainer");

                //$('.feedNotification').unbind('click').click(function () {

                //    // alert('dd');
                //    let feed_id = $(this).attr('feed_id');
                //    window.location.hash = "#livefeed?feed_id=" + feed_id;
                //    getLiveFeedDetails(feed_id);
                //});
            });

            new Template(json.notification, 'notificationTemplate', 'ntcContainer').html();
        });

    },
    getFriendRequest: function () {
        var url = host + 'api/apifriend/friendrequest';
        var token = localStorage.getItem('access_token');

        new HttpRequest(url, function () { }, token).getRequest(function (json) {

            console.log(json);
            let incomming_friendrequest = json.incomming_friendrequest;
            let outgoing_friendrequest = json.outgoing_friendrequest;
            incomming_friendrequest.forEach(function (obj) {
                if (obj.profile_picture != null) { obj.profile_picture = host + obj.profile_picture + "&size=small"; }
                else { obj.profile_picture = 'resource/images/default/profile.svg'; }
            });


            new Template(incomming_friendrequest, 'pendingFriendTemplat', 'listviewPendingRequest').append();

            e('.friend').hide();
            e('#c_pendingRequest').show();
            e('.btnAccecptRequst').on('click', function () {

                var account_id = (this).getAttribute('data-account_id');
                e(this).getClosest('.friends_row').hide()
                getChats();
            });

            e('.btnCancelRequest').click(function () {

                $(this).closest('.friends_row').hide();
                var account_id = $(this).attr('data-account_id');
                cancelFriendRequest(account_id);



            });

        });














    },
    getSingleChat: function (chat_id) {
        var token = localStorage.getItem('access_token');
        var url = host + 'api/apichat/getchat?chat_id=' + chat_id;
        new HttpRequest(url, function () { }, token).getRequest(function (json) {
            console.log(json);

            let current_chat_id = getParameterByName("id", window.location.href);

            if (json.chat.sender_account_id == current_chat_id) {
                apiCall.makeSeen(chat_id + ",");
                uiChatHistory(new Array(json.chat));
            }
            else {
                apiCall.makeDelivered(chat_id + ",");

                let _count = e('#indicator_' + json.sender_private_account_id).val();
                e('#indicator_' + json.sender_private_account_id).val(++_count);
                e('#indicator_' + json.sender_private_account_id).show();


            }
        });








    },
    makeSeen: function (seenarr) {

        var url = host + 'api/apichat/seen?chat_id_array=' + seenarr.substring(0, seenarr.length - 1);
        new HttpRequest(url, function () { }, token).getRequest(function (json) {
            console.log(json);
        });

    },
    makeDelivered: function (seenarr) {

        var url = host + 'api/apichat/delivered?chat_id_array=' + seenarr.substring(0, seenarr.length - 1);
        new HttpRequest(url, function () { }, token).getRequest(function (json) {
            console.log(json);
        });

    },
    makeNotificaitonSeen: function (id) {

        var url = host + 'api/ApiPushNotification/makeseen?id=' + id;
        new HttpRequest(url, function () { }, token).getRequest(function (json) {
            console.log("makeNotificaitonSeen: " + json.flag);
        });

    },
    searchFriend: function (text) {
        var url = host + 'api/apifriend/SearchFriends?searchtext=' + text;
        new HttpRequest(url, function () { }, token).getRequest(function (json) {
            console.log(json);
          
            e('#listview_findfriends').removeAllChildren();

            json.friends.forEach(function (obj) {

                if (obj.profile_picture!=null) {
                    obj.profile_picture = host+obj.profile_picture + "&size=small";
                }
                else {
                    obj.profile_picture = 'resource/images/default/profile.svg';
            
                }

             




            });
            new Template(json.friends, 'findFriendTemplat', 'listview_findfriends').append();

            // e("#findFriendTemplat").tmpl(obj).appendTo("#findFriendTemplat");
            e('.friend').hide();
            e('#c_findfriends').show();
            e('.btnSendRequest').on('click', function () {

                var account_id = $(this).attr('data-account_id');

                sendFriendRequest(account_id);

                e(this).hide();
                getFriendRequest();

            });


            e('.btnCancleRequest').on('click',function () {

                var account_id = $(this).attr('data-account_id');
                cancelFriendRequest(account_id);

                $(this).hide();
                $(this).closest('.chatrow_userdetails_container').hide();
                getFriendRequest();

            });



            e('.btnConfirmRequest').on('click',function () {

                var account_id = $(this).attr('data-account_id');
                acceptFriendRequest(account_id);
                $(this).closest('.chatrow_userdetails_container').hide();
                $(this).hide();
                getFriendRequest();

            });






        });
       

    }
};

function uiChatHistory(list) {

    list.forEach(function (obj) {
        if (obj.sender_profile_picture == null) {
            obj.sender_profile_picture = 'resource/images/default/profile.svg';
        }
        else {
            obj.sender_profile_picture = host + obj.sender_profile_picture;
        }
        obj.chat_state_image = host + obj.chat_state_image;
    });
    new Template(list, 'chatHistoryTemplate', 'chatHistroy').append();
    e('.chatHistoryScrollContainer').scrolledBottom();
}