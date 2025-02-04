
const share = require('./share');
const httpHead = share.httpHead;

module.exports.errorHandle = function (res) {
    res.writeHead(400, httpHead); 
    res.write(JSON.stringify({
        "status": "fail",
        "message":"ERROR!!!"
    }));
    res.end();
}
