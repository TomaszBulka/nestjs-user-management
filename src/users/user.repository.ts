import { ConflictException, InternalServerErrorException, NotAcceptableException } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "src/auth/dto/login.dto";
import { PaginationDto } from "./dto/pagination.dto";
import { UsersPaginatedDto } from "./dto/users-paginated.dto";
import { UserRole } from "./user-role.enum";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(createUserDto: CreateUserDto): Promise<void>{
        const { username, password, roles} = createUserDto;
        const user = new User();
        user.username = username;
        console.log(roles)
        console.log(UserRole.USER)
        if(roles !== UserRole.ADMIN && roles !== UserRole.USER && roles !== undefined){ throw new NotAcceptableException('roles value must be either "admin" or "user"') }
        
        user.roles = roles 
        
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        
        try {
            await user.save()
        }catch(error) {
            console.log(error)
            if(error.code === '23505'){ // duplicate usernme
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }

    async validateUserPassword(loginDto: LoginDto): Promise<string>{
        const {username, password} = loginDto;
        const user = await this.findOne({ username });

        if(user && await user.validatePassword(password)){
            user.lastLogin = new Date(Date.now())
            await user.save()
            return user.username
        }else{
            return null
        }
    }

    async getAllUsers(paginationDto: PaginationDto): Promise<UsersPaginatedDto>{
        const skippedUsers = (paginationDto.page - 1) * paginationDto.limit;
        const total = await this.count()
        const users = await this.createQueryBuilder('user')
        .orderBy('id', "ASC")
        .select(['user.id', 'user.username', 'user.createdAt', 'user.lastLogin', 'user.updatedAt'])
        .offset(skippedUsers)
        .limit(paginationDto.limit)
        .getMany()  
        

        return {
            users,
            total
        }
    }
}