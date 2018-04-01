# koa-action
![](https://img.shields.io/badge/koa--action-1.0.2-blue.svg) ![](https://img.shields.io/badge/build-passing-brightgreen.svg) ![](https://img.shields.io/badge/licence-MIT%20License-blue.svg) ![](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)

koa2 mvc framework  easy to use

`environment`: Node.js >= 7.6.0

##Installation

	git clone https://github.com/cqb325/koa-action.git

	npm install

	npm run server

	//in browser
	http://127.0.0.1:3000

2.

	npm install koa-action -save
	create file server.js
##start

	const KoaAction = require('koa-action');
	const app = new KoaAction();
	app.run();

	//run
	node server

##appointment

1、dir `routers` is the router files, each file is base router:
in admin.js:

	module.exports = {
	    '/login!GET': async function(){
	        ...
	    },

	    '/login!POST': async function(){
	        ...
	    },

	    '/chain': async function(){
	        ...
	    }
	}

we can request the url `http://127.0.0.1/admin/login` in browser to get in the '/login!GET' router.
also wo can post url `http://127.0.0.1/admin/login` to '/login!POST'.
`!GET` is optional.

in router functions we can use `this` to get the `{ctx/orm/params}` prop and
functions:

	send(body)
	json(data, msg, code)
	forward(view, data)
	redirect(url)
	chain(url)
	success(data, msg)
	fail(data, msg)
	download(file)
	isGet()
	isPost()
	isMethod(method)
	isAjax()

if defined a `service` file in service dir we can get that Service like `this.UserService`.

2、dir `service` is the service Level files, these files deal with something data or businese.

we can get database modal class use `this.orm` like:

	let {Project} = this.orm;

3、dir `static` all .js/.css/image files

4、dir `views` all pages file

5、dir `database` database middleware and table Modals
