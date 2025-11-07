import React, { useRef, useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterSideBar } from './FilterSideBar';
import type { SkillCategoriesData } from '@/entities/Skill';
import { useDirectories, convertToLegacyFormat } from '@/entities/directory';
import type { Category, Subcategory } from '@/entities/directory/model/types';

type FilterPayload = {
  general: string | null;
  gender: string | null;
  skills: SkillCategoriesData | null;
  cities: string[];
  filtersApplied: boolean;
};

const PayloadViewer: React.FC<{ payload: unknown; title?: string }> = ({
  payload,
  title = 'Payload наверх:',
}) => (
  <div
    style={{
      flex: 1,
      padding: 16,
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      background: '#fafafa',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      overflow: 'auto',
      maxHeight: '80vh',
    }}
  >
    <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {JSON.stringify(payload, null, 2)}
    </pre>
  </div>
);

const ExternalDataStory: React.FC = () => {
  const { categories, subcategories, isLoading, error } = useDirectories();

  const typedCategories = categories as Category[];
  const typedSubcategories = subcategories as Subcategory[];

  const [payload, setPayload] = useState<FilterPayload>({
    general: null,
    gender: null,
    skills: null,
    cities: [],
    filtersApplied: false,
  });

  const catalog = useMemo(() => {
    if (!typedCategories.length || !typedSubcategories.length) {
      return { skill_categories: [] };
    }

    return convertToLegacyFormat(typedCategories, typedSubcategories);
  }, [typedCategories, typedSubcategories]);

  const t = useRef<number | null>(null);
  const handleChange = (p: FilterPayload) => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setPayload(p), 100);
  };

  if (isLoading) return <div>Загрузка каталога…</div>;
  if (error) return <div style={{ color: 'crimson' }}>Ошибка: {error}</div>;

  return (
    <div
      style={{
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        maxWidth: 1200,
        padding: 20,
      }}
    >
      <div style={{ flex: '0 0 auto' }}>
        <FilterSideBar skillsCatalog={catalog} onChange={handleChange} />
      </div>
      <PayloadViewer payload={payload} />
    </div>
  );
};

const meta: Meta<typeof FilterSideBar> = {
  title: 'Filters/FilterSideBar',
  component: FilterSideBar,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof FilterSideBar>;
export const ExternalData: Story = {
  render: () => <ExternalDataStory />,
};
