import { Controller, Get, Request, Response, Query, Res } from '@nestjs/common';
import { success, error } from 'src/common/response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MultimediaService } from '../services/multimedia.service';
import { MultimediaParams } from '../constants/messages.constants';

@ApiTags('Módulo de Mensajes')
@Controller('media/v1/')
export class MultimediaController {
  constructor(private readonly mediaService: MultimediaService) {}
  //#region  Http Get Multimedia Summary
  @Get('multimedia')
  @ApiOperation({
    summary: 'Devuelve el resumen de multimedia',
  })
  async findMultimedia(
    @Request() req,
    @Response() res,
    @Query('groupId') groupId: string,
    @Query('param') param: MultimediaParams = MultimediaParams.all,
  ) {
    return await this.mediaService
      .getMultimedia(groupId, param)
      .then((data) => success(req, res, data, 200))
      .catch((e) => error(req, res, 'unexpected Error', e));
  }
  //#endregion
  @Get()
  async helo(@Request() req, @Response() res) {
    success(req, res, 'helo', 200);
  }
}
