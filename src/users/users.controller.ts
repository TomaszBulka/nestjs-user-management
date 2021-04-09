import { Body, ClassSerializerInterceptor, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiExtraModels, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetUser } from 'src/auth/guards/get-user-decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersPaginatedDto } from './dto/users-paginated.dto';
import { UserRole } from './user-role.enum';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@ApiExtraModels(PaginationDto, UsersPaginatedDto, User)
@UseGuards(AuthGuard())
export class UsersController {
    constructor(private usersService: UsersService){}

    
    @ApiCreatedResponse({
        description: 'Create user'
      })
    @ApiConflictResponse({ description: 'Username already exists' })
    @ApiForbiddenResponse({description: 'Forbidden'})
    @ApiBody({type: CreateUserDto})
    @Post('/create')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    createUser(@Body( ValidationPipe) createUserDto: CreateUserDto): Promise<void>{
        return this.usersService.createUser(createUserDto)
    }
    
    @ApiOkResponse({type: UsersPaginatedDto})
    @ApiForbiddenResponse({description: 'Forbidden'})
    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    getUsers(@Query(ValidationPipe) paginationDto: PaginationDto): Promise<UsersPaginatedDto>{
        
        return this.usersService.getAllUsers({
            ...paginationDto,
            page: !paginationDto.page ? 1: paginationDto.page,
            limit: !paginationDto.limit ? 5: paginationDto.limit
        })
            
    }

    @ApiOkResponse({type: User})
    @ApiNotFoundResponse({description: 'User with id: not found'})
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/:id')
    @ApiBearerAuth('JWT-auth')
    getUserById(@Param('id', ParseIntPipe) id: number,
    @GetUser() user : User
    ): Promise<User>{
        if(user.roles === UserRole.USER){return this.usersService.getUserById(id, user)}
        else if(user.roles === UserRole.ADMIN){return this.usersService.getUsersData(id)}    
    }

    @ApiOkResponse()
    @ApiNotFoundResponse({description: 'User with id: not found'})
    @ApiForbiddenResponse({description: 'Forbidden'})
    @UseGuards(RolesGuard)
    @Delete('/:id')
    @ApiBearerAuth('JWT-auth')
    deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
       return  this.usersService.deleteUser(id)
    }

    @ApiOkResponse({type: User})
    @ApiNotFoundResponse({description: 'User with id: not found'})
    @ApiForbiddenResponse({description: 'Forbidden'})
    @ApiBody({type: UpdateUserDto})
    @Put('/:id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RolesGuard)
    updateUsersUsername(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    ){
        return this.usersService.updateUser(id, updateUserDto)
    }
    
    
}
