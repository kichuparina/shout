


function Template(object, template, destinationid) {
    this.templateId = template;


    this.htmlTemplate = document.getElementById(template).innerHTML;


    var wrapper = document.createElement('div');
    wrapper.innerHTML = this.htmlTemplate;
    var div = wrapper.firstChild;

 // this.htmlTemplate = wrapper.innerHTML;
    
   this.htmlTemplate =  str2DOMElement(this.htmlTemplate).parentNode.innerHTML;
  
    this.destinationid = destinationid;
    this.list;
    if (Object.prototype.toString.call(object) === '[object Array]') {
        this.list = object;
    }
    else {
        this.list = new Array(object);
    }

    this.append = appendHtml;
    this.html = html;
}
function str2DOMElement(html) {
    var wrapMap = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        body: [0, "", ""],
        _default: [1, "<div>", "</div>"]
    };
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    var match = /<\s*\w.*?>/g.exec(html);
    var element = document.createElement('div');
    if (match != null) {
        var tag = match[0].replace(/</g, '').replace(/>/g, '').split(' ')[0];
        if (tag.toLowerCase() === 'body') {
            var dom = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
            var body = document.createElement("body");
            // keeping the attributes
            element.innerHTML = html.replace(/<body/g, '<div').replace(/<\/body>/g, '</div>');
            var attrs = element.firstChild.attributes;
            body.innerHTML = html;
            for (var i = 0; i < attrs.length; i++) {
                body.setAttribute(attrs[i].name, attrs[i].value);
            }
            return body;
        } else {
            var map = wrapMap[tag] || wrapMap._default, element;
            html = map[1] + html + map[2];
            element.innerHTML = html;
            // Descend through wrappers to the right content
            var j = map[0] + 1;
            while (j--) {
                element = element.lastChild;
            }
        }
    } else {
        element.innerHTML = html;
        element = element.lastChild;
       
    }
   
    return element;
}


String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
//isArray = function (a) {
//    return (!!a) && (a.constructor === Array);
//};
function getObjectValue(element, item) {
    if (element == "${comments.comment_type}") {
     // debugger;
    }
    let key = element.replace(/[${}]/g, "");
    let value = item[key];
    let k = key.split('.');
    // console.log(k);
    //if (value == null) {
    //    if (k.length > 1) {
    //        if (k[k.length - 1] == "length") {
    //            /// console.log('length found ggg' + k[1].length);
    //            key = k[1].length;
    //            // return 0;
    //        }
    //        else {
    //            key = k[1];
    //        }
    //    }
    //}
    if (value == null) {
        try {
            let obj = item;

            k.forEach(function (t)
            {
                if (element == "${comments.comment_type}") {
                   // debugger;
                }
                t = t.replace("this.", '');

                if (item.hasOwnProperty(t)) {
                    value = item[t];
                }



                if (value == null || typeof (value) == "object") {
                    let isValid = /\[[^\]]+\]|\{[^}]+\}|<[^>]+>/g.test(t);
                    if (isValid) {



                
                        // debugger;
                        if (t.indexOf("[")) {
                            let newa = t.split("[");
                            let array = obj[newa[0]][parseInt(newa[1].replace(']', ''))];
                            obj = array;
                        }
                    }
                    else if ("length" == t) {
                        value = obj.length;
                    }
                    else {
                        obj = obj[t];
                        value = obj;
                    }
                }



            });
        }
        catch (err) {
            console.log("error: " + err.message);
        }

    }

    return value;


}
function checkOperand(operand, curObj) {

    let rex = /\$\{([^\}]*)\}/g;

    let exp = operand.match(/\$\{([^\}]*)\}/g);
   // console.log(exp);
    if (exp != null) {
        exp.forEach(function (element) {

           
            operand = getObjectValue(element, curObj)

        });


        //let key = operand.replace(/[${}]/g, "");
        //let k = key.split('.');
        //if (k.length > 1) {
        //    key = k[1];

        //}
        //operand = curObj[key];
        //  console.log('object type  ' + curObj[key]);
    }
    else {
        // console.log('not object type  ' + operand);
    }
    if (operand == "true")
    {
        return true;
    }
    else if (operand == "false") {
        return false;
    }
    else if (typeof (operand) == "string") {
        return '"' + operand + '"';
    }
    return operand;

}
function getTags(html, target) {
    if (!html || !target) {
        return false;
    }
    else {
        var fragment = document.createDocumentFragment(),
            container = document.createElement('div');
        container.innerHTML = html;
        fragment.appendChild(container);
        //  var targets = fragment.firstChild.getElementsByTagName(target), result = [];
        var targets = fragment.firstChild.querySelectorAll("[" + target + "]"), result = [];
        //var targets = fragment.children, result = [];
        for (var i = 0, len = targets.length; i < len; i++) {
            let data = { outerHTML: '', innerHTML: '', nodeValue: '' };
            data.outerHTML = targets[i].outerHTML;
            data.innerHTML = targets[i].innerHTML;
            data.nodeValue = targets[i].getAttribute(target);
            result.push(data);
            //console.log(targets[i].);

        }
        return result;
    }
}

var tag = {

    "if":
    {
        rex: /\{\{(\/?)if ((.|\n)*)\{\{(\/?)\/if?\s*\}\}(?=\s|$)/g,
        is: function () { },
        func: function () { }
    },
    "else":
    {
        rex: /\{\{(\/?)else((.|\n)*)\{\{(\/?)\/else?\s*\}\}(?=\s|$)/g,
        is: function () { },
        func: function () { }
    }

};
function makeHtml(list, html, outerHtml) {
  
    if (list == null) {
        return;
    }

    let htmlBulder = '';
    list.forEach(function (item) {
        let temphtml = html;

      

        getTags(temphtml, "repeat").forEach(function (r) {

            // debugger;
            let sendHtml = r.outerHTML;
            sendHtml = sendHtml.replace("repeat", '');

            let outer = sendHtml.replace(sendHtml, 'esty');


            let loopHtml = makeHtml(item[r.nodeValue], sendHtml, null)

            temphtml = temphtml.replace(r.outerHTML, loopHtml);
        });
        let ifc = getTags(temphtml, "if").forEach(function (r) {

            let fOperand, sOperand, operators = ["==", "+", "-", "*", "/", ">", "<"];
            let sOperator = '';
            operators.forEach(function (o) {

                if (r.nodeValue.indexOf(o) > 0) {


                    let arr = r.nodeValue.split(o)
                    if (arr.length > 0) {
                        sOperator = o;
                        fOperand = checkOperand(arr[0], item);
                        sOperand = checkOperand(arr[1], item);
                    }

                }
            });
            let condition = '(' + fOperand + sOperator + sOperand + ')';


           // console.log(condition + ' ');
            let result = eval(condition);
            // console.log(condition + ' ' + result);
            let outerHTML = r.outerHTML;

            if (result == false) {
                temphtml = temphtml.replace(outerHTML, '');
                return;
            }
            //  temphtml = temphtml.replace(outerHTML, '');

        });
        temphtml = temphtml.replaceAll("this.", '');
        let template_row = temphtml;
        let exp = template_row.match(/\$\{([^\}]*)\}/g);
   
   
        if (exp != null) {
            exp.forEach(function (element) {
                let value = getObjectValue(element, item);
                template_row = template_row.replace(element, value);


            });
        }


        htmlBulder += template_row;


    });
    return htmlBulder
}

HTMLElement.prototype.prependHtml = function (element) {
    const div = document.createElement('div');
    div.innerHTML = element;
    this.insertBefore(div, this.firstChild);
};

HTMLElement.prototype.appendHtml = function (element) {
    const div = document.createElement('div');
    div.innerHTML = element;
    while (div.children.length > 0) {
        this.appendChild(div.children[0]);
    }
};
function appendHtml() {
    let len = this.list.length;
    let list = this.list;
    let html = this.htmlTemplate;
    let appendHtml = '';
   
    let fhtml = makeHtml(list, html, null);
    // document.getElementById(this.destinationid).innerHTML = fhtml;
   document.getElementById(this.destinationid).innerHTML = document.getElementById(this.destinationid).innerHTML + fhtml;
  //  document.getElementById(this.destinationid).appendHtml = fhtml;
  //  document.getElementById(this.destinationid).insertAdjacentHTML("afterBegin",fhtml);
   // let parent = document.getElementById(this.destinationid);
    // parent.appendChild(fhtml)



    // d1.insertAdjacentHTML('afterend', fhtml);
}


function html() {
    let len = this.list.length;
    let list = this.list;
    let html = this.htmlTemplate;
    let appendHtml = '';
    let fhtml = makeHtml(list, html, null);
    document.getElementById(this.destinationid).innerHTML = fhtml;

   



    // d1.insertAdjacentHTML('afterend', fhtml);
}



//new Template(arr, 'template').append();