module.exports = {
    '/login!GET': async function(){
        let {name} = this.params;
        console.log('chain param name: '+name);
        let user = await this.UserService.login();
        await this.forward('index', user);
    },

    '/login!POST': async function(){
        await this.forward('index', {
            userName: "post"
        });
    },

    //   `/admin/chain/?name=xxx`
    '/chain': async function(){
        console.log('chain test ...');
        await this.chain('/login!GET');
    }
}
