export const FiltersBar = () => {
  return (
    <aside className="filters-bar">
      <fieldset>
        <legend>Тип навыка</legend>
        <label>
          <input type="radio" name="skill-type" value="all" defaultChecked />
          Все
        </label>
        <label>
          <input type="radio" name="skill-type" value="learning" />
          Хочу научиться
        </label>
        <label>
          <input type="radio" name="skill-type" value="teaching" />
          Могу научить
        </label>
      </fieldset>

      {/*поиск*/}
      <label htmlFor="search-input">Поиск по навыкам</label>
      <input
        id="search-input"
        type="text"
        placeholder="Название навыка или автор"
        aria-label="Поиск навыков"
      />

      {/*категории*/}
      <fieldset>
        <legend>Категории</legend>
        <label>
          <input type="checkbox" id="category-business" />
          Бизнес и карьера
        </label>
        <label>
          <input type="checkbox" id="category-art" />
          Творчество и искусство
        </label>
        <label>
          <input type="checkbox" id="category-languages" />
          Иностранные языки
        </label>
        <label>
          <input type="checkbox" id="category-education" />
          Образование и развитие
        </label>
        <label>
          <input type="checkbox" id="category-health" />
          Здоровье и лайфстайл
        </label>
        <label>
          <input type="checkbox" id="category-home" />
          Дом и уют
        </label>
      </fieldset>

      {/*пол автора*/}
      <fieldset>
        <legend>Пол автора</legend>
        <label>
          <input type="radio" name="author-gender" value="any" defaultChecked />
          Не имеет значения
        </label>
        <label>
          <input type="radio" name="author-gender" value="male" />
          Мужской
        </label>
        <label>
          <input type="radio" name="author-gender" value="female" />
          Женский
        </label>
      </fieldset>

      {/*город*/}
      <fieldset>
        <legend>Город</legend>
        <label>
          <input type="checkbox" id="city-moscow" />
          Москва
        </label>
        <label>
          <input type="checkbox" id="city-spb" />
          Санкт-Петербург
        </label>
        <label>
          <input type="checkbox" id="city-novosibirsk" />
          Новосибирск
        </label>
        <label>
          <input type="checkbox" id="city-ekaterinburg" />
          Екатеринбург
        </label>
        <label>
          <input type="checkbox" id="city-kazan" />
          Казань
        </label>
      </fieldset>
    </aside>
  );
};
