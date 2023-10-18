// import { Test, TestingModule } from '@nestjs/testing';
// import { getModelToken } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User } from './schemas/user.schema';
// import { UsersService } from './users.service';

// class UserModel {
//   constructor(private data) {}
//   save = jest.fn().mockResolvedValue(this.data);
//   static find = jest.fn().mockResolvedValue([]);
//   static findById = jest.fn();
//   static findOne = jest.fn();
//   static updateOne = jest.fn();
//   static deleteOne = jest.fn();
//   // static find = jest.fn().mockResolvedValue([event]);
//   // static findOne = jest.fn().mockResolvedValue(event);
//   // static findOneAndUpdate = jest.fn().mockResolvedValue(event);
//   // static deleteOne = jest.fn().mockResolvedValue(true);
// }

// describe('UsersService', () => {
//   let service: UsersService;
//   let model: Model<User>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         {
//           provide: getModelToken(User.name),
//           useValue: UserModel,
//         },
//       ],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//     model = module.get<Model<User>>(getModelToken(User.name));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('create', () => {
//     it('should create a user', async () => {
//       const data = { email: 'test@example.com', password: 'password' };
//       const user = new model(data);
//       console.log(model);
//       const saveSpy = jest.spyOn(model.prototype, 'save'); //.mockResolvedValueOnce(user);

//       const result = await service.create(data);

//       expect(result).toEqual(data);
//       expect(saveSpy).toHaveBeenCalled();
//     });
//   });

//   // describe('findById', () => {
//   //   it('should find a user by id', async () => {
//   //     const id = '123';
//   //     const user = new User({
//   //       email: 'test@example.com',
//   //       password: 'password',
//   //     });
//   //     jest.spyOn(model, 'findById').mockReturnValueOnce({
//   //       exec: jest.fn().mockResolvedValueOnce(user),
//   //     } as any);

//   //     const result = await service.findById(id);

//   //     expect(result).toEqual(user);
//   //     expect(model.findById).toHaveBeenCalledWith(id);
//   //   });
//   // });

//   // describe('findByEmail', () => {
//   //   it('should find a user by email', async () => {
//   //     const email = 'test@example.com';
//   //     const user = new User({ email, password: 'password' });
//   //     jest.spyOn(model, 'findOne').mockReturnValueOnce({
//   //       exec: jest.fn().mockResolvedValueOnce(user),
//   //     } as any);

//   //     const result = await service.findByEmail(email);

//   //     expect(result).toEqual(user);
//   //     expect(model.findOne).toHaveBeenCalledWith({ email });
//   //   });
//   // });
// });
