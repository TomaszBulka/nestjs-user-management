import { ApiProperty } from "@nestjs/swagger";
export class LoginResponseDto{
    @ApiProperty({example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp.eyJ1c2VybmFtZSI6IlRvbWFzekIi'})
    accessToken: string
}