import { User } from "../models/types";

export class UserStorage {
  private users = new Map<string, User>();

  constructor(defaultUsers: User[] = []) {
    defaultUsers.forEach(u => this.users.set(u.id, u));
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByApiKey(apiKey: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.apiKey === apiKey);
  }

  updateUser(user: User): void {
    this.users.set(user.id, user);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
}
