import type { INotification } from '@/entities/notification/model/types/types';

export interface FormattedNotification {
  title: string;
  description: string;
  meta: string;
  link: string;
}

export const formatNotification = (notification: INotification): FormattedNotification => {
  const { from, type, date } = notification;

  let title = '';
  const description = 'предлагает вам обмен';

  switch (type) {
    case 'exchange_request':
      title = `${from.name} хочет обменяться навыками`;
      break;
    case 'exchange_accepted':
      title = `${from.name} принял ваш запрос на обмен`;
      break;
    case 'exchange_declined':
      title = `${from.name} отклонил ваш запрос`;
      break;
    case 'new_message':
      title = `Новое сообщение от ${from.name}`;
      break;
    case 'favorite_added':
      title = `${from.name} добавил вас в избранное`;
      break;
    case 'skill_updated':
      title = `${from.name} обновил навык`;
      break;
    default:
      title = 'Новое уведомление';
  }

  return {
    title,
    description,
    meta: date, // "сегодня", "вчера" и т.д.
    link: notification.link,
  };
};
