const http = require('http');
const url = require('url');
const fsPromise = require('fs/promises');
const fs = require('fs');
const path = require('path');

const port = 3000;
let app = {};
let middlewares = [];

app.use = function use(middleware) {
	middlewares.push(middleware);
	return this;
};

// register the available middleware in the middlewares arrray
app.use(logger);

// create server and routes
http.createServer(async function (req, res) {
    // run middleware factory
    run(req, res);

    const {method, url: reqURL } = req;
    const urlObject = url.parse(reqURL, true);

    if (urlObject.pathname == "/" && method == "GET") {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write("Hello, Node.js!");
        // res.end();
    } else if (urlObject.pathname == "/file" && method == "GET") {
        const data  = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa fuga deserunt cupiditate, recusandae natus reprehenderit dolores porro placeat nobis consequuntur ratione voluptatem itaque doloribus est! Animi, sit cum. Tempore, quisquam.
        Praesentium repudiandae deserunt iste voluptas possimus natus odit porro perferendis assumenda beatae, repellat explicabo quaerat delectus sit consectetur, incidunt impedit magni cumque veritatis id dignissimos debitis veniam facere recusandae. Vel.
        Blanditiis aspernatur facilis quas officia mollitia expedita obcaecati sapiente. Illum, totam. Adipisci hic, fugiat, dolor quam atque eligendi laudantium explicabo provident dolores assumenda quis perferendis nihil cum consequatur voluptas soluta!
        Quis nesciunt magnam cumque fugiat quae pariatur nam ab cupiditate eligendi accusantium quia iste earum facere, ipsa veniam ipsum, dolores amet. Necessitatibus laudantium, porro maiores soluta saepe sapiente repudiandae. Labore?
        Vero perferendis dolorum saepe voluptate quam aperiam accusantium eum facere consectetur dolorem aut quasi commodi obcaecati, explicabo nostrum natus quaerat consequuntur. Rerum sit repellendus architecto tempore excepturi dignissimos tenetur ad!`;
        const filePath = './files';
        const fileName = 'data.txt';
        const fullPath = path.join(filePath, fileName); 
        
        try {           
        
            // if ./files/data.txt exist
            if(!await fileExist(filePath) || !await fileExist(fullPath)){
                // create files folder if not exist
                if (!await fileExist(filePath)) 
                    await fsPromise.mkdir(filePath);
                // create data.txt file if not exist
                if(!await fileExist(fullPath))
                    await fsPromise.writeFile(fullPath, data, {encoding: 'utf8'});
            }

            const fileContent = await fsPromise.readFile(fullPath, {encoding: 'utf8'})
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write(fileContent);
            // res.end();
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.write(error.toString());
            // res.end();
        }
    } else if (urlObject.pathname == "/api/user" && method == "GET") {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({name: "Saad Saheed", email: "janbaaoda@gmail.com", age: 26}));
        // res.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('Not Found!');        
    }
    res.end();
}).listen(port);


let run = (function factory() {
	let slice = Array.prototype.slice;
	function fail(err) {
		throw err;
	}
	return function run() {
		let self = this;
		let i = 0;
        // server response object
		let last = arguments[arguments.length - 1];
		let done = 'function' == typeof last && last;
		let args = done
			? slice.call(arguments, 0, arguments.length - 1)
			: slice.call(arguments);

		// next step
		function next(err) {
			if (err) return (done || fail)(err);
			let middleware = middlewares[i++];
			let arr = slice.call(args);

			if (!middleware) {
				return done && done.apply(null, [null].concat(args));
			}

			arr.push(next);
			middleware.apply(self, arr);
		}

		next();

		return this;
	};
})();

// middleware
function logger(req, res, next) {
    
    try {    
        //log incoming request 
        console.log(req);
        next();
        // throw new Error("Access Denied!");
    } catch (error) {
        res.writeHead(403, {'Content-Type': 'text/html'});
        res.write(error.message);
    }
}

//check if file/folder exist
async function fileExist(path) {
    try {
        await fsPromise.access(path, fs.constants.R_OK);
        return true;
    } catch (error) {
        return false;
    }
}