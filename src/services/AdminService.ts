import { Autowired, AutoRepository } from "../../koa-action";
import { Repository } from "typeorm/repository/Repository";
import { Photo } from "../entries/Photo.entity";
import { User } from "../po/User";
const jwt = require('jsonwebtoken');

export class AdminService {
    @AutoRepository(Photo)
    private photoReposity: Repository<Photo>

    list (): string[] {
        return ['a', 'b', 'c'];
    }

    async listPhotos (): Promise<Photo[]> {
        const photos:Photo[] = await this.photoReposity.find();
        return photos;
    }

    login (user: User) {
        console.log(user);
        
        const token = jwt.sign(JSON.parse(JSON.stringify(user)), 'shared-secret', {expiresIn: '30m'});
        return token;
    }
}