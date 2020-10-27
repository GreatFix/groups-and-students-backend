const { json } = require("body-parser");

function query(url, method="GET", body=null){ 
    const headers = {
        'Content-Type': 'application/json'
    }
    return fetch(url, {
        method: method,
        body: json.stringify(body),
        headers: headers 
    }).then(res => { return res.json })
}