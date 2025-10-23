import React from 'react';

export const SkillCard = () => {
  return (
    <article className="skill-card">
      {/*информация о пользователе*/}
      <div className="user-info">
        <img
          src="/placeholder-avatar.jpg"
          alt="Аватар пользователя"
          width="48"
          height="48"
          aria-hidden="true"
        />
        <div>
          <h3>Иван</h3>
          <p>Санкт-Петербург, 34 года</p>
        </div>
      </div>

      {/*описание пользователя*/}
      <p>Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое</p>

      {/*может научить*/}
      <div>
        <strong>Может научить:</strong>
        <ul aria-label="Навыки, которые может научить">
          <li>Английский язык</li>
        </ul>
      </div>

      {/*хочет научиться*/}
      <div>
        <strong>Хочет научиться:</strong>
        <ul aria-label="Навыки, которым хочет научиться">
          <li>Тайм менеджмент</li>
          <li>Медитация</li>
        </ul>
      </div>

      {/*кнопка "Предложить обмен"*/}
      <button type="button" aria-haspopup="dialog">
        Предложить обмен
      </button>

      {/*модалка (заглушка)*/}
      <dialog open={false} aria-labelledby="modal-title" className="modal">
        <div className="modal-content">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a5 5 0 0 0-5 5c0 2.69 2.15 4.95 5 5s5-2.26 5-5a5 5 0 0 0-5-5z" />
            <path d="M12 17a2 2 0 0 0 2-2c0-2-3-2-3-2" />
          </svg>
          <h2 id="modal-title">Ваше предложение создано</h2>
          <p>Теперь вы можете предложить обмен</p>
          <button type="button">Готово</button>
        </div>
      </dialog>
    </article>
  );
};
