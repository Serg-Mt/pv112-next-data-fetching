import { useState } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import GenTable from './GenTable';
import './index.module.sass';

function Form({ columns, values, setValues }) {
  return <tr>
    {columns.map(({ title, setVal }, index) =>
      <td key={title}>
        {setVal
          ? <input value={values[index]} onInput={evt => setValues(old => old.with(index, evt.target.value))} />
          : '...'
        }
      </td>)}
    <td>
      <button data-id={''} data-action='ok'>🆗</button>
      <button data-id={''} data-action='cancel'>✖️</button>
    </td>
  </tr>;
}


export default function MainJsonSource({ config: { fetcher, columns, genObj, API_URL } }) {
  const
    // [data, setData] = useState(null),
    { data, error, isLoading, isValidating, mutate } = useSWR(API_URL, fetcher),
    [filterStr, setFilterStr] = useState(''),
    [sortByColumnN, setSortByColumnN] = useState(null), // number
    [values, setValues] = useState(columns.map(() => '-')),
    [editedId, setEditedId] = useState(null),
    filteredData = filterStr
      ? data?.filter(el => columns.map(({ getVal }) => getVal(el))
        .filter(x => 'string' === typeof x)
        .some(x => x.toLowerCase().includes(filterStr.toLowerCase())))
      : data,
    getVal = columns[Math.abs(sortByColumnN) - 1]?.getVal || (() => null),
    sortData = sortByColumnN
      ? data.toSorted((a, b) => 'string' === typeof getVal(a) ? Math.sign(sortByColumnN) * getVal(a).localeCompare(getVal(b)) : 1)
      : filteredData,
    columnsWithButtons = columns.concat({
      title: 'actions', getVal: ({ id }) => <>
        <button data-id={id} data-action='info'>ℹ️</button>
        <button data-id={id} data-action='edit'>✏️</button>
        <button data-id={id} data-action='del'>❌</button>
      </>
    });

  async function onClick(evt) {
    const
      source = evt.target.closest('button[data-action][data-id]');
    if (source) {
      const { id, action } = source.dataset;
      switch (action) {
        // case 'del':
        //   setData(old => old.filter(el => String(el.id) !== id));
        //   // fetch(API_URL+id,{method:'DELETE'});
        //   return;
        case 'edit':
          // eslint-disable-next-line no-case-declarations
          const index = data.findIndex(obj => id === String(obj.id));
          setValues(columns.map(({ getVal }) => getVal(data[index])));
          setEditedId(id);
          return;
        case 'cancel':
          setEditedId(null);
          setValues(columns.map(() => '_'));
          return;          
        case 'ok':
        //   if (editedId) { // edit
        //     const index = data.findIndex(obj => editedId === String(obj.id)),
        //       newObj = data[index];
        //     columns.forEach(({ setVal }, i) => setVal && Object.assign(newObj, setVal(values[i])));
        //     setData(data.with(index, newObj));
        //   } else { // add
        //     const newObj = genObj();
        //     columns.forEach(({ setVal }, i) => setVal && Object.assign(newObj, setVal(values[i])));
        //     setData(data.concat(newObj));
        //   }
          setEditedId(null);
          setValues(columns.map(() => '_'));
          // return;
      }
      let optimisticData;
      const promise = (() => {
        switch (action) {
          case 'del':
            optimisticData = data.filter(el => String(el.id) !== id);
            return fetch(API_URL + id, { method: 'DELETE' });
          case 'ok':
            if (editedId) { // edit
            } else { // add
              const newObj = genObj();
              columns.forEach(({ setVal }, i) => setVal && Object.assign(newObj, setVal(values[i])));
              optimisticData = data.concat(newObj);
              return fetch(API_URL,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newObj)
                })
                .then(async res => {
                  if (!res.ok) {
                    throw (new Error(res.status + ' ' + res.statusText));
                  }
                });
            }
        }
      })();
      toast.promise(promise, {
        loading: 'Fetching ' + action,
        success: 'ok',
        error: (err) => `${err.toString()}`,
      });
      await mutate(promise.then(fetcher).catch(fetcher), { optimisticData, populateCache: true, revalidate: false });
    }
    const
      th = evt.target.closest('thead th');
    if (th) {
      const newSortN = (Math.abs(sortByColumnN) === 1 + th.cellIndex)
        ? -sortByColumnN
        : 1 + th.cellIndex;
      setSortByColumnN(newSortN);
    }
  }

  return <div onClick={onClick}>
    <input value={filterStr} onInput={evt => setFilterStr(evt.target.value)} />
    <div style={{ position: 'absolute', fontSize: 'xxx-large' }}>
      {isLoading && <>⌛</>}
      {isValidating && <>👁</>}
    </div>
    {error && <>Error {error.toString()}</>}
    {data &&
      <GenTable data={sortData} columns={columnsWithButtons} sortByColumnN={sortByColumnN} editedId={editedId}>
        <Form columns={columns} values={values} setValues={setValues} />
      </GenTable>}

  </div>;
}