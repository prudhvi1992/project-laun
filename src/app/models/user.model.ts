export interface User {
  id: string;
  email: string;
  password: string;
  mobile: string;
  role: 'admin' | 'user';
  name: string;
}