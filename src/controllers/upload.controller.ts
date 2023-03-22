import { Context, Controller, Get, Log, Param, Post } from "../../koa-action";
import path from "node:path";
import fs from "node:fs";
const mkdirp = require('mkdirp');

@Controller('/file')
export default class UserController {
    @Log()
    private log: any

    @Post('/upload/:dir')
    async upload (@Context ctx: any, @Param('dir') dir: string):Promise<any> {

        const file = ctx.request.files.file;
        if (file) {
            const filePath = file.filepath;
            const name = file.originalFilename;
            const newFilename = file.newFilename;
            const newPath = path.join(path.dirname(filePath), dir, name);
            const newDir = path.join(path.dirname(filePath), dir);
            if (!fs.existsSync(newDir)) {
                mkdirp.sync(newDir);
            }
            fs.renameSync(filePath, newPath);
            return {
                path: newPath,
                name
            };
        }
        return null;
    }

    @Get('/view/:dir/:filePath')
    async view (@Param('filePath') filePath: string, @Param('dir') dir: string):Promise<any> {
        const buf = fs.readFileSync(`uploads/${dir}/${filePath}`);
        return buf;
    }
}