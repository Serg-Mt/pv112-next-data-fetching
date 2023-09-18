import style from './GenTable.module.sass';

export default function GenTable({ data, columns }) {
  return <table className={style.gentable}>
    <thead>
      <tr>
        {columns.map(({ title }) => <th key={title}>{title}</th>)}
      </tr>
    </thead>
    <tbody>
      {data.map(obj =>
        <tr key={obj.id}>
          {columns.map(({ name, getVal }) => <td key={name}>{getVal(obj)}</td>)}
        </tr>)}
    </tbody>
  </table>;
}
