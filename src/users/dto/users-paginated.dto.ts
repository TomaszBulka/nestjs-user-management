import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { User } from "../user.entity";

export class UsersPaginatedDto {
    @ApiProperty({type: 'array', items: { $ref: getSchemaPath(User)}})
    users: User[]

    @ApiProperty({example: 1})
    total: number
}