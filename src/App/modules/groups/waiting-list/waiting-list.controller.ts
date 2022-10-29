import {
  Controller,
  Get,
  Body,
  Param,
  Request,
  Response,
  Put,
} from '@nestjs/common';
import { WaitingListService } from './waiting-list.service';
import { UpdateWaitingListDto } from './dto/update-waiting-list.dto';
import { success, error } from '../../../../common/response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('waiting-list/v1')
@ApiTags('Módulo de Listas de Esperas')
export class WaitingListController {
  constructor(private readonly waitingListService: WaitingListService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Devuelve una lista de solicitudes por medio del id del grupo',
  })
  public async fetchRequests(
    @Request() req,
    @Response() res,
    @Param('id') id: string,
  ) {
    return await this.waitingListService
      .fetchRequestsAsync(id)
      .then((data) => success(req, res, data, 200))
      .catch((e) => error(req, res, 'Unexpected Error', e));
  }

  @Get('banned/:id')
  @ApiOperation({
    summary: 'Devuelve una lista de solicitudes por medio del id del grupo',
  })
  public async fetchBannedUsers(
    @Request() req,
    @Response() res,
    @Param('id') id: string,
  ) {
    return await this.waitingListService
      .fetchBannedUsers(id)
      .then((data) => success(req, res, data, 200))
      .catch((e) => error(req, res, 'Unexpected Error', e));
  }

  @Put()
  @ApiOperation({
    summary: 'Actualiza selectivamente el cuerpo de las solicitudes',
  })
  public async update(
    @Request() req,
    @Response() res,
    @Body() payload: UpdateWaitingListDto,
  ) {
    return await this.waitingListService
      .updateAsync(payload)
      .then((data) => success(req, res, data, 204))
      .catch((e) => error(req, res, 'Unexpected Error', e));
  }
}
