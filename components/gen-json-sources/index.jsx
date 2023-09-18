import { useState } from 'react';
import './index.module.sass';
import GenFetcher from './GenFetcher';
import GenTable from './GenTable';

export default function MainJsonSource({ config: { fetcher, columns } }) {
  const
    [data, setData] = useState(null),
    columnsWithButtons = columns.concat({
      title: 'actions', getVal: ({ id }) => <>
        <button data-id={id} data-action='info'>ℹ️</button>
        <button data-id={id} data-action='edit'>✏️</button>
        <button data-id={id} data-action='del'>❌</button>
      </>
    });

  function onClick(evt) {
    const
      source = evt.target.closest('button[data-action][data-id]');
    if (source) {
      const { id, action } = source.dataset;
      switch (action) {
        case 'del':
          setData(old => old.filter(el => String(el.id) !== id));
          return;
      }
    }
  }

  return <div onClick={onClick}>
    <GenFetcher fetcher={fetcher} onLoadCallback={setData} >
      <GenTable data={data} columns={columnsWithButtons} />
    </GenFetcher>
    <input type='date' />
  </div>;
}