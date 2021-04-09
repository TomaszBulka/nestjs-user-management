import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, Min } from "class-validator"

export class PaginationDto {
    
    @ApiProperty( {example: 1, required: false})
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page: number

    @ApiProperty( {example: 5, required: false})
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit: number
}