import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GenerateHashService } from "src/modules/auth/generate-hash.service";
import { ID } from "src/types/ID";
import { CreateUserDto } from "./dto/user-create.dto";
import { SearchUserParams } from "./interfaces/search-user-params.interface";
import { IUserService } from "./interfaces/user-service.interface";
import { User, UserDocument } from "./mongo.schemas/user.schema";

@Injectable()
export class UsersService implements IUserService {
    constructor(
      @InjectModel(User.name) private UserModel: Model<UserDocument>,
      private hashService: GenerateHashService,
    ) {}

    public async create(data: Partial<CreateUserDto> & Partial<User>): Promise<UserDocument> {
        data.passwordHash = this.hashService.generate(data.password);
        const user = new this.UserModel(data);
        try {
            await user.save();
            return user;
        } catch (e) {
            console.error(e);
            throw new BadRequestException("Ошибка при создании пользователя: указаны неверные данные или такой пользователь уже есть");
        }
    }

    async findById(id: ID): Promise<UserDocument | undefined> {
        return await this.UserModel.findById(id).select('-__v').exec();
    }

    async findByEmail(email: string): Promise<UserDocument | undefined> {
        return await this.UserModel.findOne({ email }).select('-__v').exec();
    }

    async findAll(params: SearchUserParams): Promise<User[]> {
        const queryParams: any = {};
        const { limit, offset } = params;
        params.email && (queryParams.email = { $regex: `.*${params.email}.*` });
        params.name && (queryParams.name = { $regex: `.*${params.name}.*` });
        params.contactPhone && (queryParams.contactPhone = { $regex: `.*${params.contactPhone}.*` });
        const query = this.UserModel.find(queryParams);
        limit && query.limit(limit);
        offset && query.skip(offset);
        return await query.select('-__v').exec();
    }
}
