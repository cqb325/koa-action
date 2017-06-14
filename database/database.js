
const Sequelize = require('sequelize');
const config = require('../config');
var fs = require('fs'),
    path = require('path');

module.exports = async (ctx, next)=>{
    let {host,port,user,password,database} = config.database;
    let sequelize = new Sequelize(database, user, password, {
        host: host,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        define: {
            timestamps: false,
            freezeTableName: true
        }
    });

    ctx.orm = sequelize;

    loadmodels(sequelize);

    await next();
}



let loadmodels = function(sequelize){
    let files = fs.readdirSync(path.join(__dirname, "models"));
    if(files){
        files.forEach(function(file){
            var name = path.basename(file,".js");
            sequelize[name] = sequelize.import(path.join(__dirname, 'models', name));
        });
    }
    // describe relationships
    (function(m) {
        // m.Interface.hasMany(m.Request,{as: "Requests", foreignKey: "imp_id"});
        // m.Interface.hasMany(m.Response,{as: "Responses", foreignKey: "imp_id"});
        // m.Project.hasMany(m.Interface,{as: "Interfaces", foreignKey: "prj_id"});
        //m.User.belongsTo(m.Role,{as: "Role", foreignKey: "roleid"});
        //m.Role.hasMany(m.User,{as: "Users", foreignKey: "roleid"});
        //m.Page.hasMany(m.Article,{as: "Articles", foreignKey: "id_page"});
        //m.Page.hasMany(m.PageMeta,{as: "Metas", foreignKey: "id_page"});
        //m.Page.belongsTo(m.Template,{as: "Template", foreignKey: "id_template"});
    })(sequelize);
};
