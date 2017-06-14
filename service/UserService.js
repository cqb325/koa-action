
module.exports = {
    login: async function() {
        let {Project} = this.orm;
        let projects = await Project.findAll({raw: true});
        //console.log(projects);
        return {
            userName: "admin"
        }
    }
}
