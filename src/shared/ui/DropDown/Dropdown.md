## Использование

Простой dropdown:

<Dropdown label="Пол" placeholder="Не указан" options={[{value:'', label:'Не
указан'},{value:'male',label:'Мужской'},{value:'female',label:'Женский'}]} />

С поиском:

<Dropdown label="Город" placeholder="Не указан"
options={[{value:'spb',label:'Санкт-Петербург'}]} />

Мультиселект с чекбоксами:

<Dropdown multiple label="Категория" placeholder="Выберите категорию"
options={[{value:'career',label:'Бизнес и карьера'}]} />
