function makeRequest(method, uri, body, cb, options){
    options = options || {};
    var xhr = new XMLHttpRequest();
    xhr.open(method,uri,true);
    xhr.onreadystatechange = function(){
        if (!cb) return;
        if(xhr.readyState !== 4) return
        if(xhr.status < 400 && xhr.status > 0) return cb(null, options.raw ? xhr.response : JSON.parse(xhr.responseText || "{}"), xhr);
        cb(xhr.status);
    };
    if (!options.raw) xhr.setRequestHeader("Content-Type","application/json");
    if (options.responseType) xhr.responseType = options.responseType;
    xhr.setRequestHeader("Accept","application/json");
    xhr.send(body);
}

module.exports.get = function(url, cb, options){
    if (Array.isArray(url)) url = url.join("/");
	makeRequest("GET", url, null, cb, options);
}

module.exports.post = function(url, data, cb, options){
    console.log(arguments);
    options = options || {};
    if (Array.isArray(url)) url = url.join("/");
    if (options.raw) return makeRequest("POST", url, data, cb, options);
    makeRequest("POST", url, (options && options.raw) ? data : JSON.stringify(data), cb, options);
}

module.exports.put = function(url, data, cb, options){
    console.log(arguments);
    options = options || {};
    if (Array.isArray(url)) url = url.join("/");
    if (options.raw) return makeRequest("PUT", url, data, cb, options);
    makeRequest("PUT", url, (options && options.raw) ? data : JSON.stringify(data), cb, options);
}

module.exports.del = function(url, cb, options){
    if (Array.isArray(url)) url = url.join("/");
    makeRequest("DELETE", url, null, cb, options);
}
