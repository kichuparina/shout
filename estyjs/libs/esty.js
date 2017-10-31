var e = function (params) {
    lib = new library(params);

    return lib;
};

var library = function (params) {
    this.element = new Array();
    var selector, count = 0;

    if (params == null) {
        return this;
    }

    
    if (params.toString().includes( "[object")) {
        /// console.log('found :' + params.toString());
        selector = params;
        this.element[0] = params;
        this.length = 1;

        return this;
    }
    else {
        selector = document.querySelectorAll(params);
        this.length = selector.length;
    }
    


    for (; count < this.length; count++) {
        this.element[count] = selector[count];
    }
    return params;
};

e.fn = library.prototype = {
    toggle: function () { },
    hide: function () {
        var len = this.length;
        while (len--) {
            this.element[len].style.display = 'none';
        }
        return this;
    },

    show: function () {
        var len = this.length;
        while (len--) {
            this.element[len].style.display = 'block';
        }

        return this;
    },
    val: function (text) {
        var len = this.length;

        while (len--) {

            let node = this.element[len];
            if (node.tagName == "INPUT") {

                if (node.type == "text" || node.type == "password" || node.type == "email") {
                    if (text == null) {
                        return node.value;
                    }
                    node.value = text;

                }
                if (node.type == "checkbox") {
                    alert("this is CheckBox.")
                }
                if (node.type == "radio") {
                    alert("this is Radio.")
                }
            }
            else if (node.tagName == "TEXTAREA") {
                if (text == null) {
                    return node.value;
                }
                node.value = text;
            }
            else if (node.tagName == "SELECT") {
                if (text == null) {


                    return node.value;
                }
                node.value = text
            }
            else {
                if (text == null)
                {
                    return node.innerHTML;
                }
                node.innerHTML = text;
            }


        }
        return this;
    },
    click: function (listener) {
        var len = this.length;

        while (len--) {
            this.element[len].addEventListener('click', listener, false);
        }
        return this;
    },
    on: function (evt, fn) {
        var len = this.length;
        while (len--) {
            if (document.addEventListener) {
                this.element[len].addEventListener(evt, fn, false);
            }
            else if (document.attachEvent) {
                this.element[len].attachEvent("on" + evt, fn);
            }
            else {
                this.element[len]["on" + evt] = fn;
            }
        }
        return this;
    },
    getObject: function (index) {
        var len = this.length;
        while (len--) {

            if (len == index) {
                return this.element[len];
            }

        }
        return this;
    },
    ggclosest: function (selector) {


        var len = this.length;
        var el;
        while (len--) {
            el = this.element[len];
        }
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
                ;
                return parent;
            }
            el = parent;
        }
        alert('fff>' + parent);
        return parent;
    },
    getClosest: function (selector) {
       
        var len = this.length;
        var elem;
        while (len--) {
            elem = this.element[len];
        }
        var firstChar = selector.charAt(0);

        // Get closest match
        for (; elem && elem !== document; elem = elem.parentNode) {

            // If selector is a class
            if (firstChar === '.') {
                if (elem.classList.contains(selector.substr(1))) {

                    let l = new library();
                    l.element[0] = elem;
                    l.length = 1;
                    return l;

                    return elem;
                }
            }

            // If selector is an ID
            if (firstChar === '#') {
                if (elem.id === selector.substr(1)) {
                    return elem;
                }
            }

            // If selector is a data attribute
            if (firstChar === '[') {
                if (elem.hasAttribute(selector.substr(1, selector.length - 2))) {
                    return elem;
                }
            }

            // If selector is a tag
            if (elem.tagName.toLowerCase() === selector) {
                return elem;
            }

        }

        return false;

    }
    , removeAllChildren: function () {
        var len = this.length;
        while (len--) {
            this.element[len].innerHTML = '';
        }
        return this;

    }, toggle: function () {

        var len = this.length;
        while (len--) {

            //this.element[len].style.display
            let property = window.getComputedStyle(this.element[len], null).getPropertyValue('display')
            if (property == "none") {
                this.element[len].style.display = 'block';
            }
            else {
                this.element[len].style.display = 'none';
            }
        }
        return this;
    }, scrolledBottom: function () {

        var len = this.length;
        while (len--) {
            this.element[len].scrollTop = this.element[len].scrollHeight;

        }
    }
};





function HttpRequest(url, beforeSendRequestMethod, headers) {
    this.url = url;
    // this.successMethod = successMethod;
    // this.failMethod = failMethod;
    this.beforeSendRequestMethod = beforeSendRequestMethod;
    // this.completeRequest = completeRequest;
    this.headers = headers;
    this.responseData = '';
}

HttpRequest.prototype.getRequest = function (completeCallback) {
    var request = new XMLHttpRequest();
    request.open('GET', this.url, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.setRequestHeader('Authorization', this.headers);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            completeCallback(JSON.parse(request.responseText));
        }
        // console.log(request.responseText);
    };
    request.onerror = function () {
        console.warn("failed to get %s page!", "<page name>");
    };
    request.send();

}
function getXHR() {
    if (window.XMLHttpRequest) {
        // Chrome, Firefox, IE7+, Opera, Safari
        return new XMLHttpRequest();
    }
    // IE6
    try {
        // The latest stable version. It has the best security, performance, 
        // reliability, and W3C conformance. Ships with Vista, and available 
        // with other OS's via downloads and updates. 
        return new ActiveXObject('MSXML2.XMLHTTP.6.0');
    } catch (e) {
        try {
            // The fallback.
            return new ActiveXObject('MSXML2.XMLHTTP.3.0');
        } catch (e) {
            alert('This browser is not AJAX enabled.');
            return null;
        }
    }
}

HttpRequest.prototype.postRequest = function (josnData, completeCallback) {

    //  var xhr = new XMLHttpRequest();

    var xhr = getXHR();
    //if(window.XMLHttpRequest) {
    //    xhr = new XMLHttpRequest();

    //} else try {
    //    xhr = new ActiveXObject('Msxml2.XMLHTTP');

    //} catch(e) {
    //    try {
    //        xhr = new ActiveXObject("Microsoft.XMLHTTP");

    //    } catch(e) {

    //    }


    xhr.open('POST', this.url, true);
    //xhr.responseType = "text";
    // xhr.dataType = "json";
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader('Authorization', this.headers);
    //xhr.withCredentials = true;



    xhr.onload = function () {


        if (xhr.status >= 200 && xhr.status < 400) {
            completeCallback(xhr.responseText);
        };


    };
    xhr.onerror = function (e) {
        console.warn("failed to get %s page!", "<page name>");
        ///alert(xhr.status + 'error occured' + e.target.status);
    };
    xhr.send(josnData);
}


HttpRequest.prototype.formRequest = function (form, completeCallback) {
    // console.log('form list');
    //console.log(form);
    var xhr = getXHR();
    xhr.open('POST', this.url, true);
    //   xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.setRequestHeader('Authorization', this.headers);


    xhr.addEventListener("progress", function (oEvent) {

        if (oEvent.lengthComputable) {
            var percentComplete = oEvent.loaded / oEvent.total;
            console.log('percentComplete: ' + percentComplete);

        } else {
            // Unable to compute progress information since the total size is unknown
        }
    });
    xhr.addEventListener("load", function () {

        console.log("The transfer is complete.");
    });
    //oReq.addEventListener("error", transferFailed);
    //oReq.addEventListener("abort", transferCanceled)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            completeCallback(xhr.responseText);
        };

    };
    xhr.onerror = function (e) {
        console.warn("failed to get %s page!", "<page name>");
        ///alert(xhr.status + 'error occured' + e.target.status);
    };

    xhr.send(form);
}

function Request(url)
{
    this.url = url;
    this.getQueryString = function (param_name) {
    
        param_name = param_name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + param_name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(this.url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
}

//HttpRequest.prototype.uploadFile = function (file_input, file_name, dataDictunary, completeCallback) {
//    try {


//        var formData = new FormData();
//        var totalFiles = document.getElementById(file_input).files.length;

//        if (totalFiles == 0) {
//            console.log("no file attatched");
//            return;
//        }
//        for (var i = 0; i < totalFiles; i++) {
//            var file = document.getElementById(file_input).files[i];

//            formData.append(file_name, file);
//        }


//        //$.each(dataDictunary, function (index, obj)
//        //{
//        //    formData.append(Key,v)

//        //});

//        //for (i = 0; i < dataDictunary.length; i++) {

//        //   let text = dataDictunary[i][0];
//        //   let value = dataDictunary[i][1];

//        //   console.log("key " + text + " has value " + value);
//        //   formData.append(text, value);
//        //}


//        $.each(dataDictunary, function (key, value) {
//            // alert(key + '  ' + value);
//            formData.append(key, value)
//        });


//        $.ajax({
//            // Your server script to process the upload
//            url: this.url,
//            type: 'POST',
//            data: formData,
//            // Tell jQuery not to process data or worry about content-type
//            // You *must* include these options!
//            dataType: 'json',
//            contentType: false,
//            processData: false,
//            cache: false,
//            headers: headers,
//            // Custom XMLHttpRequest
//            success: function (data) { this.responseData = data; },
//            error: function (xhr, textStatus, errorThrown) {
//                console.log("error url : " + this.url + " says " + xhr.responseText);
//            },
//            //complete: function ()
//            //{

//            //    alert(this.responseData.message);
//            //},

//            complete: function () {

//                var json = this.responseData;
//                completeCallback(json)
//            },
//            beforeSend: this.beforeSendRequestMethod,

//            xhr: function () {
//                var myXhr = $.ajaxSettings.xhr();
//                if (myXhr.upload) {
//                    // For handling the progress of the upload
//                    myXhr.upload.addEventListener('progress', function (e) {
//                        if (e.lengthComputable) {

//                            var percentComplete = Math.ceil((e.loaded / e.total) * 100);
//                            console.log('percentComplete: ' + percentComplete);
//                            //$('#Progress').css('display', 'block');
//                            console.log(e.total + "--" + e.loaded);

//                            //$('progress').attr({
//                            //    value: e.loaded,
//                            //    max: e.total,
//                            //});
//                        }
//                    }, false);
//                }
//                return myXhr;
//            },
//        });
//    }
//    catch (err) {
//        alert("ajaxUploadFile: " + err.message);
//    }
//}







