import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty({ example: 'newname'})
    username: string
}