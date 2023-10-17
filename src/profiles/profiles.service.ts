import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './schema/profile.schema';
import { Account } from 'src/accounts/schema/account.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profile: Model<Profile>,
    @InjectModel(Account.name) private account: Model<Account>,
  ) {}

  async create(
    createProfileDto: CreateProfileDto,
    session?: mongoose.ClientSession,
  ): Promise<Profile | null> {
    const profileNew = new this.profile(createProfileDto);
    if (session) {
      return await profileNew.save({ session: session });
    }
    return await profileNew.save();
  }

  async findOne(id: string | number): Promise<Profile> {
    const profile = await this.profile.findById(id).exec();
    return profile;
  }

  async findAccountsById(id: string): Promise<Account[]> {
    const profile = await this.findById(id);
    return profile.accounts;
  }

  async findById(id: string): Promise<Profile> {
    const objectId = new Types.ObjectId(id);
    const foundProfile = await this.profile.findById(objectId);

    if (!foundProfile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    const profile = await foundProfile.populate('accounts');
    profile.accounts.forEach((account) => {
      if (account.credentials) {
        delete account.credentials.password;
      }
    });

    return profile;
  }

  async findByEmail(
    email: string,
    session?: mongoose.ClientSession,
  ): Promise<Profile | null> {
    const account = await this.account
      .findOne({ 'credentials.email': email })
      .session(session);
    if (account) {
      const profile = await this.profile
        .findById(account.profile)
        .session(session);
      if (profile) {
        return profile;
      }
    }
    return null;
  }

  async findByToken(token: string): Promise<Profile | null> {
    const account = await this.account.findOne({
      'credentials.accessToken': token,
    });
    if (account) {
      const profile = await this.profile.findById(account.profile);
      if (profile) {
        return profile;
      }
    }
    return null;
  }

  async findAll(): Promise<Profile[]> {
    return await this.profile.find().exec();
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    await this.profile.findByIdAndUpdate(id, updateProfileDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<Profile> {
    return await this.profile.findByIdAndDelete(id).exec();
  }
}
