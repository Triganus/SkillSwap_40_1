// Встроенные данные для serverless functions
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadJSON(filename) {
  const filePath = path.join(__dirname, '../../public/db', filename);
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

export const categoriesData = loadJSON('categories.json');
export const subcategoriesData = loadJSON('subcategories.json');
export const citiesData = loadJSON('cities.json');
export const gendersData = loadJSON('genders.json');
export const usersData = loadJSON('users-v2.json');

