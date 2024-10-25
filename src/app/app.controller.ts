import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('service')
export class AppController {
  @Get('readiness')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Api is ready' })
  isReady(): null {
    return null;
  }
}
