export interface User {
  id: number;
  email: string;
  displayName: string;
  password?: string;
  insertedAt?: Date;
  updatedAt?: Date;
}
