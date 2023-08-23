import { Controller, Post, Body, ValidationPipe, Get, Param, Req, Put, Delete, UseGuards, UnauthorizedException } from '@nestjs/common';
import { CredentialsService } from '../services/service';
import { CreateCredentialsDto } from '../dto/create-credentials.dto';
import { Credentials } from '../schema';
import { UpdateCredentialsDto } from '../dto/update-credentials.dto';
import { RolesAuthGuard } from '../../auth/roles-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserType } from '../../common/enums/user.enum';

@Controller('credentials')
@UseGuards(RolesAuthGuard)
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  //Creates credentials for a user
  @Post()
  @Roles(UserType.Owner, UserType.Renter)
  async createCredentials(@Body
    (new ValidationPipe()) createCredentialsDto: CreateCredentialsDto,
    @Req() req
    ): Promise<Credentials> {
    return this.credentialsService.create(createCredentialsDto, req.user);
  }

  //Returns all credentials of a user
  @Get()
  @Roles(UserType.Owner, UserType.Renter)
  async getAllCredentialss(@Req() req): Promise<Credentials[]> {
    return this.credentialsService.findAll(req.user);
  }

  //Returns specific credentials of a user
  @Get(':id')
  @Roles(UserType.Owner, UserType.Renter)
  async getCredentialsById(@Param('id') id: string, @Req() req): Promise<Credentials> {

    const user = req.user;
    const credentials = await this.credentialsService.findById(id)

    if (credentials.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to view these credentials.');
    }

    return this.credentialsService.findById(id);
  }

  //Updates specific credentials of a user
  @Put(':id')
  @Roles(UserType.Owner, UserType.Renter)
  async updateCredentials(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateCredentialsDto,
    @Req() req
  ): Promise<Credentials> {

    const user = req.user;
    const credentials = await this.credentialsService.findById(id)

    if (credentials.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to update these credentials.');
    }

    return this.credentialsService.updateById(id, updateUserDto);
  }

  //Deletes specific credentials of a user
  @Delete(':id')
  @Roles(UserType.Owner, UserType.Renter)
  async deleteCredentials(@Param('id') id: string, @Req() req): Promise<Credentials> {

    const user = req.user;
    const credentials = await this.credentialsService.findById(id)

    if (credentials.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to delete these credentials.');
    }

    return this.credentialsService.deleteById(id);
  }
}
