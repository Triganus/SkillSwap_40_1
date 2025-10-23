import type { User } from '../entities/user/model/types/types';

/**
 * Загружает список всех пользователей из JSON файла
 * @returns Promise с массивом пользователей
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch('/db/users.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const users: User[] = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
