var _self;
function EstyJs() {
    try {
        this.routes = [];
        _self = this;

        var anchors = document.getElementsByTagName("a");
        for (var i = 0, length = anchors.length; i < length; i++) {
            var anchor = anchors[i];
            anchor.addEventListener('click', this.onhashchange, true);
        };
        window.addEventListener("hashchange", this.onhashchange);
    }
    catch (err) {
        console.log(err);
    }
    // this.onPageLoad = onPageLoad;
}

function getHashTag2(hashtag) {
    let tag = hashtag.replace(/^[a-z]{4}\:\/{2}[a-z]{1,}\:[0-9]{1,4}.(.*)/, '$1');
    tag = tag.replace('#', '');
    let index = tag.indexOf("?");
    if (index > 0) {
        tag = tag.substring(0, index);
    }
    return tag;
}
function getUrlParameter(url) {
    let paramArray = [];
    url = url.replace("?", "&");
    let sPageURL = url,
    sURLVariables = sPageURL.split('&');
    for (let i = 1; i < sURLVariables.length; i++) {
        let paramValue = sURLVariables[i].split('=');
        let obj = { "key": paramValue[0], "value": paramValue[1] };
        paramArray.push(obj);
    }
    return paramArray;
}



function stripAndExecuteScript(text) {
    var scripts = '';
    var cleaned = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function () {
        scripts += arguments[1] + '\n';
        return '';
    });

    if (window.execScript) {
        window.execScript(scripts);
    } else {
        var head = document.getElementsByTagName('head')[0];
        var scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'text/javascript');
        scriptElement.innerText = scripts;
        head.appendChild(scriptElement);
        head.removeChild(scriptElement);
    }
    return cleaned;
};
//function insertHtml(id, html) {
//    var ele = document.getElementById(id);
//    ele.innerHTML = html;
//    var codes = ele.getElementsByTagName("script");
//    for (var i = 0; i < codes.length; i++) {
//        eval(codes[i].text);
//    }
//}

function insertHtml(divId, innerHTML) {
    var div = document.getElementById(divId);
    div.innerHTML = innerHTML;
    var x = div.getElementsByTagName("script");
    for (var i = 0; i < x.length; i++) {
        // console.log( x[i].getAttribute("src"));
        let attribute = x[i].getAttribute("src");
        if (attribute != null && attribute.length > 2) {
            var newScript = document.createElement("script");
            //newScript.src = x[i].getAttribute("src");
            newScript.src = "http://localhost:68/controllers/livefeed.js";
            // document.getElementById(divId).appendChild(newScript);
            document.body.appendChild(newScript);
            // break;
        }
        else {

            eval(x[i].text);
        }
        // document.getElementById(divId).appendChild(newScript);


    }
}
EstyJs.prototype.getUrlDetails = function () {
    let data = { pageName: '', queryString: '' };
    data.pageName = window.location.pathname.toLocaleLowerCase().replace('/','');
    let full_url = window.location.href;
    let paramArray = full_url.split("?");
    if (paramArray.length > 1) {
        query_string = '?' + paramArray[1];
        data.queryString = '?' + paramArray[1];
    }
    return data;
}
EstyJs.prototype.redirectPage = function (hashtag, query_string) {
    logic(hashtag, query_string);

}


function logic(hashtag, query_string) {
    if (hashtag == null || hashtag.length==0) {
        let url = window.location.pathname;
        let full_url = window.location.href;

     
        let paramArray = full_url.split("?");
        if (paramArray.length > 1) { query_string = '?' + paramArray[1]; }

        if (url != "/") {
            hashtag = getHashTag2(url.replace('/', '#'))
        }
        else {
            hashtag = _self.routes[0].displayUrl;
        }
    }

    //  console.log(hashtag);
    var section = document.getElementById('app').getElementsByTagName("section");
    for (var i = 0; i < section.length; i++) {
        section[i].style.display = 'none';
    }
    let isRouteFound = false;
    for (var i = 0; i < _self.routes.length; i++) {
        if (_self.routes[i].displayUrl == hashtag) {
            isRouteFound = true;
            document.title = _self.routes[i].pageTitle;
            let id = _self.routes[i].section.replace('#', '');
            let selector = document.getElementById(_self.routes[i].section.replace('#', ''));
            let flag = selector.getAttribute('content-loaded');

            _self.onPageLoading(_self.routes[i].pageTitle, flag || false);
            if (flag == 'true' && _self.routes[i].isContentLoadingEverytime == false) {
                selector.setAttribute('content-loaded', true);
                selector.style.display = '';
                redirect('/' + hashtag, query_string);
                return;
            }
            var request = new XMLHttpRequest();
            request.open('GET', window.location.origin + '/views/' + _self.routes[i].pageLocation, true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            //request.responseType = "document";
            // request.responseType = 'document';
            redirect('/' + hashtag, query_string);
            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {

                    // console.log(request);
                    selector.setAttribute('content-loaded', true);
                    selector.innerHTML = request.response;

                    // selector.innerHTML = stripAndExecuteScript(request.responseText);
                    insertHtml(id, request.responseText);
                    selector.style.display = '';


                }
            };
            request.onerror = function () {
                console.warn("failed to get %s page!", "<page name>");
            };
            request.send();


            //let data = $.get(window.location.origin + '/views/' + _self.routes[i].pageLocation, "html").done(function (html) {
            //   // console.log(html);

            //    $(_self.routes[i].section).attr('content-loaded', true);
            //    $(_self.routes[i].section).html(html);
            //    $(_self.routes[i].section).show();

            //    //bug fix
            //    window.history.pushState('page2', 'Title', '/' + hashtag);
            //}).fail(function () { console.warn("failed to get %s page!", "<page name>"); });

            return;
        }
    }

    if (isRouteFound == false) {
        console.warn("no route found", "<page name>");
        var x = document.createElement("SECTION");
        x.setAttribute("id", "errorpage");
        document.getElementById('app').appendChild(x);
        let errorPageSelector = document.getElementById('errorpage');
        errorPageSelector.innerHTML = '<h3>opps!</h3> <p>no route found</p>';
        errorPageSelector.style.display = '';
    }
}
EstyJs.prototype.initPage = function (hashtag,query_string) {



  
    logic(hashtag, query_string);

}
function ChangeUrl(page, url) {
    if (typeof (history.pushState) != "undefined") {
        var obj = { Page: page, Url: url };
        history.pushState(obj, obj.Page, obj.Url);
    } else {
        window.location.href = "homePage";
        // alert("Browser does not support HTML5.");
    }
}


function redirect(hashtag, query_string) {

    if (query_string == null) {
        query_string = "";
    }

    var stateObj = { foo: "bar" };
    window.history.pushState(stateObj, 'Title', hashtag + query_string);
    //  history.replaceState('data to be passed', 'Title of the page', hashtag + query_string);
}
EstyJs.prototype.onhashchange = function (e) {
    let hashtag = this.getAttribute('href');
    var arr = getUrlParameter(hashtag);
    e.preventDefault();
    hashtag = getHashTag2(hashtag);

    _self.initPage(hashtag)
    for (var i = 0; i < arr.length; i++) {
        if (i == 0) {
            hashtag += "?" + arr[i].key + "=" + arr[i].value;
        }
        else {
            hashtag += "&" + arr[i].key + "=" + arr[i].value;
        }
    }
    // window.history.pushState('page2', 'Title', '/' + hashtag);

    redirect('/' + hashtag, null);
}

