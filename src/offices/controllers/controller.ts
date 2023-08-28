import { Controller, Post, Body, ValidationPipe, Get, Param, NotFoundException, Put, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { OfficeService } from '../services/service';
import { CreateOfficeDto } from '../dto/create-office.dto';
import { Office } from '../schema';
import { UpdateOfficeDto } from '../dto/update-office.dto';
import { RolesAuthGuard } from '../../auth/roles-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserType } from '../../common/enums/user.enum';

@Controller('offices')
@UseGuards(RolesAuthGuard)
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  //Creates office of an owner
  @Post()
  @Roles(UserType.Owner)
  async createOffice(
    @Body(new ValidationPipe()) createOfficeDto: CreateOfficeDto,
    @Req() req
    ): Promise<Office> {
    return this.officeService.create(createOfficeDto, req.user.id);
  }

  //Returns all offices of an owner
  @Get()
  @Roles(UserType.Owner)
  async getAllOffices(@Req() req): Promise<Office[]> {
    return this.officeService.findAll(req.user.id);
  }

  //Returns specific office of an owner (accessible by everyone)
  @Get(':id')
  async getOfficeById(@Param('id') id: string): Promise<Office> {
    return this.officeService.findById(id);
  }

  //Updates specific office of an owner
  @Put(':id')
  @Roles(UserType.Owner)
  async updateOffice(
    @Param('id') officeID: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateOfficeDto,
    @Req() req
  ): Promise<Office> {

    const office = await this.officeService.findById(officeID)

    if (office.owner.toString() !== req.user.id) {
      throw new UnauthorizedException('You are not authorized to update this office.');
    }

    return this.officeService.updateById(officeID, updateUserDto);
  }

  //Deletes specific office of an owner
  @Delete(':id')
  @Roles(UserType.Owner)
  async deleteOffice(
    @Param('id') officeID: string, 
    @Req() req
  ): Promise<Office> {
    
    const office = await this.officeService.findById(officeID)

    if (office.owner.toString() !== req.user.id) {
      throw new UnauthorizedException('You are not authorized to delete this office.');
    }
    return this.officeService.deleteById(officeID);
  }
}
