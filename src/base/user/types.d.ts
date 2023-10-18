interface SearchUserParams extends Paginated {
  email?: string;
  name?: string;
  contactPhone?: string;
}

interface IUserService {
  create(data: Partial<IUser>): Promise<IUser>;
  findById(id: ID): Promise<IUser>;
  findByEmail(email: string): Promise<IUser>;
  findAll(params: SearchUserParams): Promise<IUser[]>;
}

type IUser = {
  name: string;
  email: string;
  passwordHash: string;
  contactPhone: string;
  role: UserRole;
};

type UserRole = 'admin' | 'client' | 'manager';
