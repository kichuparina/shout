var _self;
function EstyJs() {
    this.routes = [];
    _self = this;
    $('a').click(this.onhashchange);
    $(window).on('hashchange', this.onhashchange);
}


function getUrlParameter(url) {
    var paramArray = [];
    url = url.replace("?", "&");
    var sPageURL = url,
    sURLVariables = sPageURL.split('&');


    for (var i = 1; i < sURLVariables.length; i++) {
        var paramValue = sURLVariables[i].split('=');

        let key = paramValue[0];
        let value = paramValue[1];

        var obj = { "key": key, "value": value };
        paramArray.push(obj);


    }

    return paramArray;
}



EstyJs.prototype.initPage = function (hashtag, pageClickedListener) {
    let url = window.location.pathname;
    alert('pring sfsf');
    console.log('current url : ' + url);
    //alert(hashtag);
    if (hashtag == null) {
        

        if (url != "/") {
            var re = /#([-0-9A-Za-z]+)(\:(.+))?/;
            var match = re.exec(url.replace('/', '#'));
            console.log(match);
            hashtag = match[1];
        }
        else {
            hashtag = _self.routes[0].displayUrl;
        }

    }


    $('#app section').hide();
    let isRouteFound = false;

    for (var i = 0; i < _self.routes.length; i++) {
        if (_self.routes[i].displayUrl == hashtag) {
            isRouteFound = true;
            document.title = _self.routes[i].pageTitle;
            let flag = $(_self.routes[i].section).attr('content-loaded');

            if ($.trim(flag) == 'true') {
                $(_self.routes[i].section).attr('content-loaded', true);
                $(_self.routes[i].section).show();
                return;
            }

            let pageUrl = window.location.origin + '/views/' + _self.routes[i].pageLocation;
            let data = $.get(pageUrl, "html").done(function (html) {
                console.log(html);

                $(_self.routes[i].section).attr('content-loaded', true);
                $(_self.routes[i].section).html(html);
                $(_self.routes[i].section).show();
               // alert('dd');
                pageClickedListener();
            }).fail(function () { console.warn("failed to get %s page!", "<page name>"); });
            break;
            return;
        }
    }
    console.warn("no route found", "<page name>");
    if (isRouteFound == false) {
        $('#app').append('<section id="errorpage"></section>');
        $('#errorpage').html('<h3>opps!</h3> <p>no route found</p>');
        $('#errorpage').show();
    }
}

EstyJs.prototype.onhashchange = function (e) {
    let hashtag = $(this).attr('href');
    var arr = getUrlParameter(hashtag);
    e.preventDefault();
    var re = /#([-0-9A-Za-z]+)(\:(.+))?/;
    var match = re.exec(hashtag);
    hashtag = match[1];



    //finding route



    _self.initPage(hashtag)






    for (var i = 0; i < arr.length; i++) {
        if (i == 0) {
            hashtag += "?" + arr[i].key + "=" + arr[i].value;
        }
        else {
            hashtag += "&" + arr[i].key + "=" + arr[i].value;
        }


    }




    window.history.pushState('page2', 'Title', '/' + hashtag);

}

