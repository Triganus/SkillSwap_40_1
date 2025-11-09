import { useState } from 'react';
import { CitiesSideBar } from './CitiesSideBar';
import type { TCitiesSideBarProps } from './TCitiesSideBarProps';

export const CitiesSideBarWithOutput = (args: TCitiesSideBarProps & { defaultSelected?: string[] }) => {
  const [selected, setSelected] = useState<string[]>(args.defaultSelected ?? args.value ?? []);

  return (
    <div style={{ maxWidth: 360 }}>
      <CitiesSideBar {...args} value={selected} onChange={setSelected} />

      <div style={{ marginTop: 12 }}>
        <div style={{ opacity: 0.7, marginBottom: 6 }}>Выбранные города:</div>
        {selected.length ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {selected.map((city) => (
              <li key={city}>{city}</li>
            ))}
          </ul>
        ) : (
          <div>ничего не выбрано</div>
        )}
      </div>
    </div>
  );
};
