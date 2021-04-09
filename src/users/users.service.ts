import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersPaginatedDto } from './dto/users-paginated.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ){}

    async createUser(createUserDto: CreateUserDto): Promise<void>{
        return this.userRepository.createUser(createUserDto)
    }

    async getAllUsers(paginationDto: PaginationDto): Promise<UsersPaginatedDto>{
        const result = await this.userRepository.getAllUsers(paginationDto)
        return result
    }

    async getCurrentUser(id: number): Promise<User>{
        const user = await this.userRepository.findOne(id)
        return user
    }

    

    async deleteUser(id: number): Promise<void> {
        const result = await this.userRepository.delete(id)
        if(result.affected === 0){
            throw new NotFoundException(`User with id: ${id} not found`)  
        }

    }
    async getUserById(
        id: number,
        user: User
        ): Promise<User>{
        const found =  await this.userRepository.findOne(id);
        if(!found || found.id !== user.id ){
            throw new UnauthorizedException(`Unauthorized access`);
        }        
            return found 
    }

    async getUsersData(id: number){

        const found =  await this.userRepository.findOne(id);
        if(!found){
            throw new NotFoundException(`User with id: ${id} not found`);
        } 
            return found       
    }

    async updateUser(
        id: number,
        updateUserDto: UpdateUserDto): Promise<User>{
        const user = await this.getUsersData(id)
        const { username } = updateUserDto;      
        user.username = username;
        await user.save()
        return user;
    }


}
