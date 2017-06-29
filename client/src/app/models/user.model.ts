export interface User {
  id: number
  username: string
  email: string,
  password?: string,
  insertedAt?: Date
  updatedAt?: Date
}
