// Встроенные данные для serverless functions - встроены прямо в код для Vercel

export const categoriesData = {
  "categories": [
    {
      "id": "business",
      "name": "Бизнес и карьера",
      "order": 1,
      "subcategoryIds": ["bus_001", "bus_002", "bus_003", "bus_004", "bus_005", "bus_006", "bus_007", "bus_008"]
    },
    {
      "id": "languages",
      "name": "Иностранные языки",
      "order": 2,
      "subcategoryIds": ["lang_001", "lang_002", "lang_003", "lang_004", "lang_005", "lang_006", "lang_007"]
    },
    {
      "id": "home",
      "name": "Дом и уют",
      "order": 3,
      "subcategoryIds": ["home_001", "home_002", "home_003", "home_004", "home_005", "home_006"]
    },
    {
      "id": "art",
      "name": "Творчество и искусство",
      "order": 4,
      "subcategoryIds": ["art_001", "art_002", "art_003", "art_004", "art_005", "art_006", "art_007", "art_008"]
    },
    {
      "id": "education",
      "name": "Образование и развитие",
      "order": 5,
      "subcategoryIds": ["edu_001", "edu_002", "edu_003", "edu_004", "edu_005", "edu_006"]
    },
    {
      "id": "health",
      "name": "Здоровье и образ жизни",
      "order": 6,
      "subcategoryIds": ["hlth_001", "hlth_002", "hlth_003", "hlth_004", "hlth_005", "hlth_006", "hlth_007"]
    }
  ]
};

export const subcategoriesData = {
  "subcategories": [
    { "id": "bus_001", "name": "Управление командой", "categoryId": "business" },
    { "id": "bus_002", "name": "Маркетинг и реклама", "categoryId": "business" },
    { "id": "bus_003", "name": "Продажи и переговоры", "categoryId": "business" },
    { "id": "bus_004", "name": "Личный бренд", "categoryId": "business" },
    { "id": "bus_005", "name": "Резюме и собеседование", "categoryId": "business" },
    { "id": "bus_006", "name": "Тайм-менеджмент", "categoryId": "business" },
    { "id": "bus_007", "name": "Проектное управление", "categoryId": "business" },
    { "id": "bus_008", "name": "Предпринимательство", "categoryId": "business" },
    { "id": "art_001", "name": "Рисование и иллюстрация", "categoryId": "art" },
    { "id": "art_002", "name": "Фотография", "categoryId": "art" },
    { "id": "art_003", "name": "Видеомонтаж", "categoryId": "art" },
    { "id": "art_004", "name": "Музыка и звук", "categoryId": "art" },
    { "id": "art_005", "name": "Актёрское мастерство", "categoryId": "art" },
    { "id": "art_006", "name": "Креативное письмо", "categoryId": "art" },
    { "id": "art_007", "name": "Арт-терапия", "categoryId": "art" },
    { "id": "art_008", "name": "Декор и DIY", "categoryId": "art" },
    { "id": "lang_001", "name": "Английский", "categoryId": "languages" },
    { "id": "lang_002", "name": "Французский", "categoryId": "languages" },
    { "id": "lang_003", "name": "Испанский", "categoryId": "languages" },
    { "id": "lang_004", "name": "Немецкий", "categoryId": "languages" },
    { "id": "lang_005", "name": "Китайский", "categoryId": "languages" },
    { "id": "lang_006", "name": "Японский", "categoryId": "languages" },
    { "id": "lang_007", "name": "Подготовка к экзаменам (IELTS, TOEFL)", "categoryId": "languages" },
    { "id": "edu_001", "name": "Личностное развитие", "categoryId": "education" },
    { "id": "edu_002", "name": "Навыки обучения", "categoryId": "education" },
    { "id": "edu_003", "name": "Когнитивные техники", "categoryId": "education" },
    { "id": "edu_004", "name": "Скорочтение", "categoryId": "education" },
    { "id": "edu_005", "name": "Навыки преподавания", "categoryId": "education" },
    { "id": "edu_006", "name": "Коучинг", "categoryId": "education" },
    { "id": "home_001", "name": "Уборка и организация", "categoryId": "home" },
    { "id": "home_002", "name": "Домашние финансы", "categoryId": "home" },
    { "id": "home_003", "name": "Приготовление еды", "categoryId": "home" },
    { "id": "home_004", "name": "Домашние растения", "categoryId": "home" },
    { "id": "home_005", "name": "Ремонт", "categoryId": "home" },
    { "id": "home_006", "name": "Хранение вещей", "categoryId": "home" },
    { "id": "hlth_001", "name": "Йога и медитация", "categoryId": "health" },
    { "id": "hlth_002", "name": "Питание и ЗОЖ", "categoryId": "health" },
    { "id": "hlth_003", "name": "Ментальное здоровье", "categoryId": "health" },
    { "id": "hlth_004", "name": "Осознанность", "categoryId": "health" },
    { "id": "hlth_005", "name": "Физические тренировки", "categoryId": "health" },
    { "id": "hlth_006", "name": "Сон и восстановление", "categoryId": "health" },
    { "id": "hlth_007", "name": "Баланс жизни и работы", "categoryId": "health" }
  ]
};

export const citiesData = {
  "cities": [
    { "id": "city_msk", "name": "Москва" },
    { "id": "city_spb", "name": "Санкт-Петербург" },
    { "id": "city_nsk", "name": "Новосибирск" },
    { "id": "city_ekb", "name": "Екатеринбург" },
    { "id": "city_kzn", "name": "Казань" },
    { "id": "city_nnv", "name": "Нижний Новгород" },
    { "id": "city_chel", "name": "Челябинск" },
    { "id": "city_sam", "name": "Самара" },
    { "id": "city_ufa", "name": "Уфа" },
    { "id": "city_rst", "name": "Ростов-на-Дону" },
    { "id": "city_omsk", "name": "Омск" },
    { "id": "city_krsk", "name": "Красноярск" },
    { "id": "city_vrn", "name": "Воронеж" },
    { "id": "city_perm", "name": "Пермь" },
    { "id": "city_vlg", "name": "Волгоград" }
  ]
};

export const gendersData = {
  "genders": [
    { "id": "", "name": "Не имеет значения" },
    { "id": "male", "name": "Мужской" },
    { "id": "female", "name": "Женский" }
  ]
};

export const usersData = {
  "users": [
    {
      "id": "user1",
      "name": "Иван",
      "email": "ivanivan@mail.ru",
      "birthDate": "1990-05-23",
      "gender": "male",
      "cityId": "city_spb",
      "avatar": "/db/avatars/ivan.png",
      "bio": "Профессиональный барабанщик с многолетним опытом. Люблю делиться знаниями и учиться новому.",
      "canTeachSkillIds": ["art_004"],
      "wantsToLearnSkillIds": ["bus_006", "hlth_001", "art_001", "lang_002"],
      "likedSkillIds": [],
      "createdAt": 1673740800000
    },
    {
      "id": "user2",
      "name": "Анна",
      "email": "anna.english@mail.ru",
      "birthDate": "1998-03-15",
      "gender": "female",
      "cityId": "city_kzn",
      "avatar": "/db/avatars/anna.png",
      "bio": "Преподаватель английского языка. Активно изучаю новые навыки и делюсь знаниями.",
      "canTeachSkillIds": ["lang_001"],
      "wantsToLearnSkillIds": ["art_001", "lang_002", "home_001"],
      "likedSkillIds": [],
      "createdAt": 1676851200000
    },
    {
      "id": "user3",
      "name": "Максим",
      "email": "maxim.business@mail.ru",
      "birthDate": "2001-08-14",
      "gender": "male",
      "cityId": "city_msk",
      "avatar": "/db/avatars/maxim_new.png",
      "bio": "Молодой предприниматель, специализируюсь на создании бизнес-планов. Стремлюсь к постоянному развитию.",
      "canTeachSkillIds": ["bus_008"],
      "wantsToLearnSkillIds": ["bus_001", "bus_002", "edu_001", "art_002", "hlth_002"],
      "likedSkillIds": [],
      "createdAt": 1678406400000
    },
    {
      "id": "user4",
      "name": "Илона",
      "email": "ilona.english@mail.ru",
      "birthDate": "1991-07-20",
      "gender": "female",
      "cityId": "city_ekb",
      "avatar": "/db/avatars/ilona.png",
      "bio": "Преподаватель английского языка с опытом работы за рубежом. Люблю изучать новые навыки.",
      "canTeachSkillIds": ["lang_001"],
      "wantsToLearnSkillIds": ["art_002", "home_001", "edu_002"],
      "likedSkillIds": [],
      "createdAt": 1710460800000
    },
    {
      "id": "user5",
      "name": "Михаил",
      "email": "mikhail.english@mail.ru",
      "birthDate": "1995-12-10",
      "gender": "male",
      "cityId": "city_nsk",
      "avatar": "/db/avatars/mikhail.png",
      "bio": "Преподаватель английского языка. Активно развиваюсь в разных направлениях.",
      "canTeachSkillIds": ["lang_001"],
      "wantsToLearnSkillIds": ["bus_003", "lang_003", "art_003", "hlth_003"],
      "likedSkillIds": [],
      "createdAt": 1720569600000
    },
    {
      "id": "user6",
      "name": "Мария",
      "email": "maria.english@mail.ru",
      "birthDate": "2003-04-05",
      "gender": "female",
      "cityId": "city_rst",
      "avatar": "/db/avatars/maria_new.png",
      "bio": "Молодой преподаватель английского языка. Энергичная и открытая для новых знаний.",
      "canTeachSkillIds": ["lang_001"],
      "wantsToLearnSkillIds": ["bus_004", "art_005"],
      "likedSkillIds": [],
      "createdAt": 1741478400000
    },
    {
      "id": "user7",
      "name": "Виктория",
      "email": "victoria.drums@mail.ru",
      "birthDate": "1994-09-12",
      "gender": "female",
      "cityId": "city_perm",
      "avatar": "/db/avatars/victoria_kemerovo.png",
      "bio": "Профессиональная барабанщица. Люблю музыку и стремлюсь к гармонии в жизни.",
      "canTeachSkillIds": ["art_004"],
      "wantsToLearnSkillIds": ["bus_007", "lang_004", "home_003"],
      "likedSkillIds": [],
      "createdAt": 1744156800000
    },
    {
      "id": "user8",
      "name": "Елизавета",
      "email": "elizaveta.drums@mail.ru",
      "birthDate": "1999-06-18",
      "gender": "female",
      "cityId": "city_vlg",
      "avatar": "/db/avatars/elizaveta.png",
      "bio": "Талантливая барабанщица. Активно развиваюсь и изучаю новые навыки.",
      "canTeachSkillIds": ["art_004"],
      "wantsToLearnSkillIds": ["edu_003", "art_006", "hlth_004"],
      "likedSkillIds": [],
      "createdAt": 1675555200000
    },
    {
      "id": "user9",
      "name": "Виктория",
      "email": "victoria.sochi@mail.ru",
      "birthDate": "1993-11-25",
      "gender": "female",
      "cityId": "city_rst",
      "avatar": "/db/avatars/victoria_sochi.png",
      "bio": "Опытная барабанщица с многолетним стажем. Стремлюсь к постоянному развитию.",
      "canTeachSkillIds": ["art_004"],
      "wantsToLearnSkillIds": ["home_002", "lang_005", "hlth_005"],
      "likedSkillIds": [],
      "createdAt": 1715289600000
    },
    {
      "id": "user10",
      "name": "Елена",
      "email": "elena.drums@mail.ru",
      "birthDate": "1996-02-14",
      "gender": "female",
      "cityId": "city_krsk",
      "avatar": "/db/avatars/elena_krasnoyarsk.png",
      "bio": "Профессиональная барабанщица. Люблю музыку и стремлюсь к совершенству.",
      "canTeachSkillIds": ["art_004"],
      "wantsToLearnSkillIds": ["edu_004", "art_007", "home_004"],
      "likedSkillIds": [],
      "createdAt": 1673308800000
    },
    {
      "id": "user11",
      "name": "Константин",
      "email": "konstantin.drums@mail.ru",
      "birthDate": "1988-10-08",
      "gender": "male",
      "cityId": "city_omsk",
      "avatar": "/db/avatars/konstantin.png",
      "bio": "Опытный барабанщик с многолетним стажем. Делюсь знаниями и учусь новому.",
      "canTeachSkillIds": ["art_004"],
      "wantsToLearnSkillIds": ["bus_005", "lang_006", "home_005", "hlth_006"],
      "likedSkillIds": [],
      "createdAt": 1711152000000
    },
    {
      "id": "user12",
      "name": "София",
      "email": "sofia.drums@mail.ru",
      "birthDate": "2000-01-30",
      "gender": "female",
      "cityId": "city_sam",
      "avatar": "/db/avatars/sofia.png",
      "bio": "Молодая барабанщица с большим потенциалом. Активно развиваюсь в музыке.",
      "canTeachSkillIds": ["art_004"],
      "wantsToLearnSkillIds": ["edu_005", "art_008", "home_006"],
      "likedSkillIds": [],
      "createdAt": 1741564800000
    },
    {
      "id": "user13",
      "name": "Екатерина",
      "email": "ekaterina.drums@mail.ru",
      "birthDate": "1991-05-22",
      "gender": "female",
      "cityId": "city_perm",
      "avatar": "/db/avatars/ekaterina.png",
      "bio": "Профессиональная барабанщица. Люблю музыку и стремлюсь к постоянному развитию.",
      "canTeachSkillIds": ["art_004"],
      "wantsToLearnSkillIds": ["edu_006", "lang_007", "hlth_007"],
      "likedSkillIds": [],
      "createdAt": 1711238400000
    },
    {
      "id": "user14",
      "name": "Дарья",
      "email": "darya.drums@mail.ru",
      "birthDate": "1998-08-16",
      "gender": "female",
      "cityId": "city_ufa",
      "avatar": "/db/avatars/darya.png",
      "bio": "Талантливая барабанщица. Активно изучаю новые навыки и делюсь знаниями.",
      "canTeachSkillIds": ["art_004"],
      "wantsToLearnSkillIds": ["bus_001", "art_003", "edu_002", "hlth_005", "lang_001"],
      "likedSkillIds": [],
      "createdAt": 1749513600000
    },
    {
      "id": "user15",
      "name": "Алла",
      "email": "alla.drums@mail.ru",
      "birthDate": "2002-12-03",
      "gender": "female",
      "cityId": "city_vrn",
      "avatar": "/db/avatars/alla.png",
      "bio": "Молодая барабанщица с большим энтузиазмом. Стремлюсь к совершенству в музыке.",
      "canTeachSkillIds": ["art_004"],
      "wantsToLearnSkillIds": ["bus_006", "hlth_001"],
      "likedSkillIds": [],
      "createdAt": 1754611200000
    },
    {
      "id": "user00",
      "name": "Карабас-Барабас",
      "email": "karabas@mail.ru",
      "birthDate": "1950-12-03",
      "gender": "male",
      "cityId": "city_msk",
      "avatar": "/db/avatars/karabas.png",
      "bio": "Страшный и ужасный кукольный барабанщик.",
      "canTeachSkillIds": ["bus_001", "art_005"],
      "wantsToLearnSkillIds": ["art_001", "art_002", "bus_003"],
      "likedSkillIds": [],
      "createdAt": 1754611200000
    },
    {
      "id": "user22",
      "name": "Пикачу",
      "email": "pikachu@mail.ru",
      "birthDate": "1996-02-27",
      "gender": "male",
      "cityId": "city_kzn",
      "avatar": "/db/avatars/pikachu.png",
      "bio": "Молодой покемон, любящий накатить пивка в гараже с друзьями",
      "canTeachSkillIds": ["art_004"],
      "wantsToLearnSkillIds": ["bus_006", "hlth_001", "lang_001"],
      "likedSkillIds": [],
      "createdAt": 1754611200000
    }
  ]
};
