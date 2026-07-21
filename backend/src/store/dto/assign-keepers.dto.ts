import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class AssignKeepersDto {
    @ApiProperty({ type: [String], example: ['uuid-do-usuario'] })
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', { each: true })
    keeperIds: string[];
}
