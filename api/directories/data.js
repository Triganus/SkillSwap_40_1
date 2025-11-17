// Встроенные данные для serverless functions
import categoriesData from '../../public/db/categories.json' assert { type: 'json' };
import subcategoriesData from '../../public/db/subcategories.json' assert { type: 'json' };
import citiesData from '../../public/db/cities.json' assert { type: 'json' };
import gendersData from '../../public/db/genders.json' assert { type: 'json' };
import usersData from '../../public/db/users-v2.json' assert { type: 'json' };

export { categoriesData, subcategoriesData, citiesData, gendersData, usersData };

