import type { Meta, StoryObj } from '@storybook/react';
import { useDirectories } from '@/entities/directory';
import type { Category, Subcategory, City } from '@/entities/directory/model/types';

type CategoryWithSubcategories = Category & {
  subcategories: Subcategory[];
};

/**
 * Пример использования справочников
 */
const DirectoriesExample = () => {
  const {
    categories,
    subcategories,
    cities,
    categoriesWithSubcategories,
    isLoading,
    isReady,
    error,
  } = useDirectories();

  const typedCategories = categories as Category[];
  const typedSubcategories = subcategories as Subcategory[];
  const typedCities = cities as City[];
  const typedCategoriesWithSubs = categoriesWithSubcategories as CategoryWithSubcategories[];

  if (isLoading) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Загрузка справочников...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Ошибка загрузки</h2>
        <p>{String(error)}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Справочники приложения</h1>

      <div
        style={{
          marginBottom: '20px',
          padding: '10px',
          background: '#e8f5e9',
          borderRadius: '4px',
        }}
      >
        <strong>Статус:</strong> {isReady ? '✅ Готово' : '⏳ Загружается'}
      </div>

      {/* Категории */}
      <section style={{ marginBottom: '30px' }}>
        <h2>Категории ({typedCategories.length})</h2>
        <div style={{ display: 'grid', gap: '10px' }}>
          {typedCategories.map((category) => (
            <div
              key={category.id}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: '#f5f5f5',
              }}
            >
              <strong>{category.name}</strong>
              <div style={{ fontSize: '12px', color: '#666' }}>
                ID: {category.id} | Подкатегорий: {category.subcategoryIds.length}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Категории с подкатегориями */}
      <section style={{ marginBottom: '30px' }}>
        <h2>Категории с подкатегориями</h2>
        {typedCategoriesWithSubs.map((category) => (
          <details key={category.id} style={{ marginBottom: '10px' }}>
            <summary
              style={{
                cursor: 'pointer',
                padding: '10px',
                background: '#2196F3',
                color: 'white',
                borderRadius: '4px',
              }}
            >
              {category.name} ({category.subcategories.length})
            </summary>
            <div style={{ padding: '10px', border: '1px solid #ddd', borderTop: 'none' }}>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {category.subcategories.map((sub) => (
                  <li key={sub.id}>
                    {sub.name}
                    <span style={{ fontSize: '11px', color: '#999', marginLeft: '8px' }}>
                      ({sub.id})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </section>

      {/* Подкатегории */}
      <section style={{ marginBottom: '30px' }}>
        <h2>Все подкатегории ({typedSubcategories.length})</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '10px',
          }}
        >
          {typedSubcategories.slice(0, 20).map((sub) => (
            <div
              key={sub.id}
              style={{
                padding: '8px',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '13px',
              }}
            >
              <div style={{ fontWeight: '500' }}>{sub.name}</div>
              <div style={{ fontSize: '11px', color: '#999' }}>{sub.id}</div>
            </div>
          ))}
        </div>
        {typedSubcategories.length > 20 && (
          <p style={{ marginTop: '10px', color: '#666' }}>
            ... и ещё {typedSubcategories.length - 20} подкатегорий
          </p>
        )}
      </section>

      {/* Города */}
      <section>
        <h2>Города ({typedCities.length})</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '8px',
          }}
        >
          {typedCities.map((city) => (
            <div
              key={city.id}
              style={{
                padding: '6px 10px',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '14px',
                background: 'white',
              }}
            >
              {city.name}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const meta: Meta<typeof DirectoriesExample> = {
  title: 'Examples/Directories',
  component: DirectoriesExample,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof DirectoriesExample>;

export const Default: Story = {};
