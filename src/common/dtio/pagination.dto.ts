import { IsOptional, IsPositive, Min } from 'class-validator';


export class PaginationDto {
  
  @IsOptional()
  @IsPositive()
  @Min(1)
  public limit?: number;

  @IsOptional()
  @IsPositive()
  public offset?: number;
}


