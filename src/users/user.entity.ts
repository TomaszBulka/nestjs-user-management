import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt'
import { UserRole } from "./user-role.enum";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
@Unique(['username'])
export class User extends BaseEntity{
    
    @ApiProperty({ example: 1})
    @PrimaryGeneratedColumn()
    id: number;
    
    @ApiProperty({ example: 'Tomek'})
    @Column()
    username: string;

    
    @Exclude()
    @Column()
    password: string;

    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty()
    @Column({default: null})
    lastLogin: Date;

    @Exclude()
    @Column()
    salt: string;

    @Exclude()
    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    roles: UserRole;


    async validatePassword(password: string): Promise<boolean>{
        const hash =  await bcrypt.hash(password, this.salt);
        return hash === this.password
    }

}