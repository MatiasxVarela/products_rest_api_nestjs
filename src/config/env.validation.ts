import { plainToInstance } from 'class-transformer';
import { IsNumber, IsPositive, Max, Min, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNumber()
  @IsPositive()
  @Min(0)
  PRECIO_USD: number;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number = 3000;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
