const share = require('./share');

const http = require("http"); // 內建的 module
const utility = require('./utility'); // 自行實作的 module
const errorHandler = require('./errorHandler');

// const httpHead = {
//     "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Requested-With",
//     "Access-Control-Allow-Origin":"*",
//     "Access-Control-Allow-Methods":"PATCH, POST, GET, OPTIONS, DELETE",
//     "Content-Type":"application/json"
// };

const httpHead = share.httpHead;
let todos = [];

const requestListener = (req, res) => {

    const url = req.url;
    const method = req.method;

    let body = "";
    let cnt = 0;
    req.on('data', chunk => {
        cnt++;
        // console.log(`${cnt} :`, chunk);
        body += chunk;
    });

    if (url === '/todos' && method === 'GET') {
        res.writeHead(200, httpHead);
        // convert the object to a string for network transmission 
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
        }));
        res.end();
    } else if (url === '/' && method === 'OPTIONS') {
        /*
            - Cross-Origin Resource Sharing (CORS), a preflight request is sent by the browser to check if the server will allow the actual request (like a GET, POST, or PUT) to be made. The preflight request ensures that the server will accept the request based on certain conditions like method types or headers, preventing issues during the actual request. (當網頁要發出跨網域網請求時，瀏覽器會先發出 preflight request))
            
            - preflight refers to a process that happens before a main action can be performed
        */
        res.writeHead(200, httpHead);
        res.end();
    } else if (url === '/todos' && method === 'POST') {
        req.on('end', () => {
            // console.log("end - ", body);

            try {
                obj = JSON.parse(body);

                const todo = utility.generateTodo(obj.title);
                if (todo !== undefined) {
                    todos.push(todo);
        
                    res.writeHead(200, httpHead); 
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos,
                    }));
                    res.end();
                } else {
                    errorHandler.errorHandle(res);
                }
            } catch {
                errorHandler.errorHandle(res); 
            }
        });
    } else if (url === '/todos' && method === 'DELETE') {
        todos.length = 0;
        res.writeHead(200, httpHead);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
        }));
        res.end();
    } else if (url.startsWith('/todos/') && method === 'DELETE') {
        const id = url.split('/').pop();
        const index = todos.findIndex(element => element.id === id); 
        
        if (index !== -1) {
            todos.splice(index, 1);

            res.writeHead(200, httpHead);
            res.write(JSON.stringify({
                "status": "success",
                "data": todos,
            }));
            res.end();
        } else {
            errorHandler.errorHandle(res);
        }
    } else if (url.startsWith('/todos/') && method === 'PATCH') {
        req.on('end', () => {
            // console.log("end - ", body);
            try {
                obj = JSON.parse(body);
                const id = url.split('/').pop();
                const index = todos.findIndex(element => element.id === id); 

                if (utility.isTitleValid(obj.title) && (index !== -1)) {
                    const todo = todos[index];
                    todo.title = obj.title;
        
                    res.writeHead(200, httpHead);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos,
                    }));
                    res.end();
                } else {
                    errorHandler.errorHandle(res);
                }
            } catch {
                errorHandler.errorHandle(res);
            }
        });
    } else {
        res.writeHead(404, httpHead);
        res.write(JSON.stringify({
            "status": "fail",
            "message":"page not found"
        }));
        res.end();
    }
};

const server = http.createServer(requestListener);
server.listen(3005);
