interface CreateUserParams {
  email: string;
  password: string;
  name: string;
  contactPhone: string;
}

interface AdminCreateUserParams extends CreateUserParams {
  role: UserRole;
}
