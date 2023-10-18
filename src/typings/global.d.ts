type ObjectWith<PropKey extends string, T> = {
  [key: string]: unknown;
} & {
  [K in PropKey]?: T;
};

type Paginated = {
  offset?: number;
  limit?: number;
};

interface EnvConfig {
  AUTH_SECRET: string;
  HTTP_HOST: string;
  HTTP_PORT: string;
  MONGO_HOST: string;
  MONGO_PORT: string;
  MONGO_DB_NAME: string;
  MONGO_DB_USER: string;
  MONGO_DB_PASSWORD: string;
}
