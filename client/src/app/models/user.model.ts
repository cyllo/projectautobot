export interface User {
  id: number;
  email: string;
  displayName: string;
  battleNetId: number;
  battleNetTag: string;
  password?: string;
  insertedAt?: Date;
  updatedAt?: Date;
}
