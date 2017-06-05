import {User} from './user.model'

export interface BlogPost {
  id: number
  content: string
  title: string
  imageUrl: string
  author: User
}
