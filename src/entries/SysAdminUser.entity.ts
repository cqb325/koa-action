import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity('sys_admin_user')
export class SysAdminUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    tel: string;
    
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    province: string;

    @Column({name: 'create_time'})
    createTime: Date;

    @Column()
    company: string;

    //备注
    @Column()
    remarks: string;

    //是否可用，默认为可用1
    @Column()
    enable: string;

    //保留字段1
    @Column()
    reserved1: string;
    
    //保留字段2
    reserved2: string;
    
    //加密密码用
    @Column()
    salt: string;
    
    //角色：管理员，超级管理员
    @Column()
    role: string;
    
    //最近一次存储的密码（也是用户的当前密码）
    @Column({name: 'password_first'})
    passwordFirst: string;

    //最近第二次存储的密码
    @Column({name: 'password_second'})
    passwordSecond: string;

    // 最近三次存储的密码
    @Column({name: 'password_third'})
    passwordThird: string;
    
    // 最近四次存储的密码
    @Column({name: 'password_fourth'})
    passwordFourth: string;
    
    // 最近五次存储的密码
    @Column({name: 'password_fifth'})
    passwordFifth: string;

    @Column({name: 'error_login_times'})
    errorLoginTimes: number;

    @Column({name: 'error_ip'})
    errorIp: string;

    @Column({name: 'error_ip_times'})
    errorIpTimes: number;

    @Column({name: 'error_time'})
    errorTime: Date;
}