import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength, Matches, IsOptional } from "class-validator";
import { type } from "node:os";
import { UserRole } from "src/users/user-role.enum";


export class CreateUserDto {
    @ApiProperty(
        {example: 'tomek'}
    )
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @ApiProperty(
        {example: 'aA123!@#'}
    )
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak'})
    password: string

    @ApiProperty({ required: false, example: 'user'})
    @IsOptional()
    roles: UserRole
}