import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

export async function getJwtConfig(
  config: ConfigService,
): Promise<JwtModuleOptions> {
  return {
    signOptions: {
      algorithm: 'HS512',
    },
  };
}
