import { ApiProperty } from "@nestjs/swagger";

export class LoginDto{
    @ApiProperty({ example: 'Tomasz'})
    username: string;

    @ApiProperty({example: 'aA123!@#'})
    password: string;
}