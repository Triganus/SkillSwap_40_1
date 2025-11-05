import type { DbUser } from '@/entities/user/model/types/types';

export type NotificationType =
  | 'exchange_request'
  | 'exchange_accepted'
  | 'exchange_declined'
  | 'new_message'
  | 'favorite_added'
  | 'skill_updated';

export interface INotification {
  id: string;
  type: NotificationType;
  date: string;
  from: DbUser;
  to: DbUser;
  isViewed: boolean;
  relatedSkillId?: string;
  link: string;
}

export interface INotificationList {
  new: INotification[];
  viewed: INotification[];
}
