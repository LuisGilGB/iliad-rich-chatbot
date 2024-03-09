import { Role } from './Role';

export type Message = {
  id: string;
  content: string;
  name?: string;
  role: Role;
};
