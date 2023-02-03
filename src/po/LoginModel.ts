import { IsNotEmpty } from 'class-validator';

export class LoginModel {
    @IsNotEmpty()
    u: string
    p: string
    captcha: string
}