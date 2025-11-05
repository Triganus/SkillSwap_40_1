import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppliedFilters } from './AppliedFilters';
import type { FilterPayload } from '@/entities/filterSideBar/model';
import type { SkillCategoriesData } from '@/entities/Skill';

const meta: Meta<typeof AppliedFilters> = {
  title: 'Widgets/AppliedFilters',
  component: AppliedFilters,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof AppliedFilters>;

// Мок-данные для фильтров
const mockSkillsData: SkillCategoriesData = {
  skill_categories: [
    {
      category: 'Творчество и искусство',
      skills: [
        {
          skill_id: 'art_004',
          skill_name: 'Музыка и звук',
          skill_image: '',
        },
      ],
    },
    {
      category: 'Иностранные языки',
      skills: [
        {
          skill_id: 'lang_001',
          skill_name: 'Английский',
          skill_image: '',
        },
      ],
    },
  ],
};

// Обработчик удаления фильтра
const handleRemoveFilter = (filterType: string, filterValue: string) => {
  console.log(`Удалить фильтр: тип=${filterType}, значение=${filterValue}`);
};

// Базовая история с одним фильтром (general)
export const SingleGeneralFilter: Story = {
  args: {
    filters: {
      general: 'Хочу научиться',
      gender: null,
      skills: null,
      cities: [],
      filtersApplied: true,
    },
    onRemoveFilter: handleRemoveFilter,
  },
};

// История с одним навыком
export const SingleSkillFilter: Story = {
  args: {
    filters: {
      general: null,
      gender: null,
      skills: {
        skill_categories: [
          {
            category: 'Иностранные языки',
            skills: [
              {
                skill_id: 'lang_001',
                skill_name: 'Английский',
                skill_image: '',
              },
            ],
          },
        ],
      },
      cities: [],
      filtersApplied: true,
    },
    onRemoveFilter: handleRemoveFilter,
  },
};

// История с одним городом
export const SingleCityFilter: Story = {
  args: {
    filters: {
      general: null,
      gender: null,
      skills: null,
      cities: ['Москва'],
      filtersApplied: true,
    },
    onRemoveFilter: handleRemoveFilter,
  },
};

// История с полом автора
export const GenderFilter: Story = {
  args: {
    filters: {
      general: null,
      gender: 'Мужской',
      skills: null,
      cities: [],
      filtersApplied: true,
    },
    onRemoveFilter: handleRemoveFilter,
  },
};

// История с несколькими фильтрами разных типов
export const MultipleFilters: Story = {
  args: {
    filters: {
      general: 'Хочу научиться',
      gender: null,
      skills: {
        skill_categories: [
          {
            category: 'Иностранные языки',
            skills: [
              {
                skill_id: 'lang_001',
                skill_name: 'Английский',
                skill_image: '',
              },
            ],
          },
        ],
      },
      cities: [],
      filtersApplied: true,
    },
    onRemoveFilter: handleRemoveFilter,
  },
};

// История со всеми типами фильтров
export const AllFilterTypes: Story = {
  args: {
    filters: {
      general: 'Могу научить',
      gender: 'Женский',
      skills: mockSkillsData,
      cities: ['Москва', 'Санкт-Петербург'],
      filtersApplied: true,
    },
    onRemoveFilter: handleRemoveFilter,
  },
};

// История с несколькими навыками
export const MultipleSkills: Story = {
  args: {
    filters: {
      general: null,
      gender: null,
      skills: {
        skill_categories: [
          {
            category: 'Творчество и искусство',
            skills: [
              {
                skill_id: 'art_001',
                skill_name: 'Рисование и иллюстрация',
                skill_image: '',
              },
              {
                skill_id: 'art_004',
                skill_name: 'Музыка и звук',
                skill_image: '',
              },
            ],
          },
          {
            category: 'Иностранные языки',
            skills: [
              {
                skill_id: 'lang_001',
                skill_name: 'Английский',
                skill_image: '',
              },
              {
                skill_id: 'lang_002',
                skill_name: 'Французский',
                skill_image: '',
              },
            ],
          },
        ],
      },
      cities: [],
      filtersApplied: true,
    },
    onRemoveFilter: handleRemoveFilter,
  },
};

// История с несколькими городами
export const MultipleCities: Story = {
  args: {
    filters: {
      general: null,
      gender: null,
      skills: null,
      cities: ['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск'],
      filtersApplied: true,
    },
    onRemoveFilter: handleRemoveFilter,
  },
};

// История с пустыми фильтрами (компонент не отображается)
export const EmptyFilters: Story = {
  args: {
    filters: {
      general: null,
      gender: null,
      skills: null,
      cities: [],
      filtersApplied: false,
    },
    onRemoveFilter: handleRemoveFilter,
  },
};

// История с фильтрами, но filtersApplied = false (компонент не отображается)
export const FiltersNotApplied: Story = {
  args: {
    filters: {
      general: 'Всё',
      gender: 'Не имеет значения',
      skills: null,
      cities: [],
      filtersApplied: false,
    },
    onRemoveFilter: handleRemoveFilter,
  },
};

// Интерактивная история с состоянием
export const Interactive: Story = {
  render: () => {
    const InteractiveStory: React.FC = () => {
      const initialFilters: FilterPayload = {
        general: 'Хочу научиться',
        gender: null,
        skills: {
          skill_categories: [
            {
              category: 'Иностранные языки',
              skills: [
                {
                  skill_id: 'lang_001',
                  skill_name: 'Английский',
                  skill_image: '',
                },
              ],
            },
          ],
        },
        cities: ['Москва'],
        filtersApplied: true,
      };
      const [filters, setFilters] = useState<FilterPayload>(initialFilters);

      const handleRemove = (filterType: string, filterValue: string) => {
        setFilters((prev: FilterPayload) => {
          const next: FilterPayload = { ...prev };

          switch (filterType) {
            case 'general':
              next.general = null;
              break;
            case 'skill':
              if (next.skills?.skill_categories) {
                next.skills = {
                  skill_categories: next.skills.skill_categories
                    .map((cat) => ({
                      ...cat,
                      skills: cat.skills.filter((s) => s.skill_id !== filterValue),
                    }))
                    .filter((cat) => cat.skills.length > 0),
                };
                if (next.skills.skill_categories.length === 0) {
                  next.skills = null;
                }
              }
              break;
            case 'city':
              next.cities = next.cities.filter((city) => city !== filterValue);
              break;
            case 'gender':
              next.gender = null;
              break;
          }

          // Пересчитываем filtersApplied
          next.filtersApplied =
            (next.general !== null && next.general !== 'Всё') ||
            (next.gender !== null && next.gender !== 'Не имеет значения') ||
            (next.skills?.skill_categories?.some((cat) => cat.skills.length > 0) ?? false) ||
            next.cities.length > 0;

          return next;
        });
      };

      return (
        <div style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '16px' }}>Интерактивный пример</h3>
          <p style={{ marginBottom: '16px', color: '#666' }}>
            Кликните на крестик, чтобы удалить фильтр
          </p>
          <AppliedFilters filters={filters} onRemoveFilter={handleRemove} />
          <div
            style={{
              marginTop: '24px',
              padding: '12px',
              background: '#f5f5f5',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '12px',
            }}
          >
            <strong>Текущее состояние фильтров:</strong>
            <pre style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(filters, null, 2)}
            </pre>
          </div>
        </div>
      );
    };

    return <InteractiveStory />;
  },
};
