// FilterSideBar.stories.tsx
import React, { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterSideBar } from './FilterSideBar';
import type { SkillCategoriesData } from '@/entities/Skill';

// Тип для данных, которые поднимает компонент
type FilterPayload = {
  general: string | null;
  gender: string | null;
  skills: SkillCategoriesData | null;
  cities: string[];
  filtersApplied: boolean;
};

// ---------- Вспомогательная обёртка для вывода payload ----------
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
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      overflow: 'auto',
      maxHeight: '80vh',
    }}
  >
    <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
    <pre
      style={{
        margin: 0,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {JSON.stringify(payload, null, 2)}
    </pre>
  </div>
);

// ---------- Основная история ----------
const ExternalDataStory: React.FC = () => {
  const [catalog, setCatalog] = useState<SkillCategoriesData>({
    skill_categories: [],
  });
  const [payload, setPayload] = useState<FilterPayload>({
    general: null,
    gender: null,
    skills: null,
    cities: [],
    filtersApplied: false,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // 🔹 Фетч реальных данных из public/db/skills.json
        const res = await fetch('/db/skills.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: SkillCategoriesData = await res.json();
        if (!cancelled) {
          setCatalog(json);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : String(e));
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 🔹 Чтобы не дёргать ререндер при каждом onChange
  const t = useRef<number | null>(null);
  const handleChange = (p: FilterPayload) => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setPayload(p), 100);
  };
  useEffect(
    () => () => {
      if (t.current) window.clearTimeout(t.current);
    },
    []
  );

  if (loading) return <div>Загрузка каталога…</div>;
  if (err) return <div style={{ color: 'crimson' }}>Ошибка: {err}</div>;

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
      {/* Левая колонка — сам фильтр */}
      <div style={{ flex: '0 0 auto' }}>
        <FilterSideBar skillsCatalog={catalog} onChange={handleChange} />
      </div>

      {/* Правая колонка — JSON-пейлоад */}
      <PayloadViewer payload={payload} />
    </div>
  );
};

// ---------- Метаданные сторибука ----------
const meta: Meta<typeof FilterSideBar> = {
  title: 'Filters/FilterSideBar',
  component: FilterSideBar,
  parameters: {
    layout: 'fullscreen', // чтобы было больше места по ширине
  },
};
export default meta;

type Story = StoryObj<typeof FilterSideBar>;
export const ExternalData: Story = {
  render: () => <ExternalDataStory />,
};
