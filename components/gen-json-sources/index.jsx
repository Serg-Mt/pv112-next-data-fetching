import { useState } from 'react';
import './index.module.sass';
import GenFetcher from './GenFetcher';
import GenTable from './GenTable';

export default function MainJsonSource({ config: { fetcher, columns } }) {
  const
    [data, setDate] = useState(null);

  return <>
    <GenFetcher fetcher={fetcher} onLoadCallback={setDate} >
      <GenTable data={data} columns={columns}/>
    </GenFetcher>
  </>;
}