import { storage } from "../utils/storage";
import { User } from "../models/user"; 
export class UserRepository {
  getById(id: string): User | undefined {
    return storage.getUserById(id);
  }
  getByApiKey(apiKey: string): User | undefined {
    return storage.getUserByApiKey(apiKey);
  }
  update(user: User): void {
    storage.updateUser(user);
  }
}
