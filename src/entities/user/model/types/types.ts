export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  createdAt: string;
}

export type DbUser = {
  id: string;
  name: string;
  date_of_birth?: string;
  age?: number;
  date_of_registration?: string;
  about_me?: string;
  avatar_image?: string;
  gender?: string;
  user_profession?: string;
  is_online?: boolean;
  location?: string;
  contacts?: { phone?: string; email?: string };
  my_skills?: {
    teach?: { skill_id: string; skill_description: string }[];
    learn?: { skill_id: string; skill_description: string }[];
  };
  offers?: {
    incoming?: unknown[];
    outgoing?: unknown[];
    archived?: unknown[];
  };
};

export type AuthUser = &DbUser
