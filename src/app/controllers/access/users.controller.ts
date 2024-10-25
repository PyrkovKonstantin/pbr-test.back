import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleEnum } from '../../../common/enum/role.enum';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../../common/guard/permission.guard';
import {
  ApiGetAllResponse,
  ApiGetOneResponse,
} from '../../../common/http/responses/api-ok-response';
import User from '../../../database/entities/access/user.entity';
import { CreateUserDto } from '../../dtos/access/users/create-user.dto';
import { UpdateUserDto } from '../../dtos/access/users/update-user.dto';
import { PageMetaDto } from '../../dtos/page/dto/page-meta.dto';
import { PageOptionsDto } from '../../dtos/page/dto/page-options.dto';
import { PageDto } from '../../dtos/page/dto/page.dto';
import { UserService } from '../../services/access/users.service';

@ApiTags('Пользователи')
@ApiExtraModels(User)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Добавить пользователя' })
  @ApiGetOneResponse(User)
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get()
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiQuery({ name: 'customer', required: false, type: Boolean })
  @ApiGetAllResponse(User)
  async findAll(
    @Query() page: PageOptionsDto,
    @Query('customer') customer?: boolean,
  ) {
    const [users, total] = await this.userService.findAll(page, customer);

    return new PageDto(
      users,
      new PageMetaDto({
        pageOptionsDto: page,
        itemCount: total,
      }),
    );
  }

  @Get('roles')
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Получить все роли пользователей' })
  @ApiGetAllResponse(User)
  async findAllRoles() {
    return this.userService.findAllRoles();
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Получить пользователя' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
