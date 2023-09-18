import Link from 'next/link';
import styles from './Header.module.css';

const pages = [
  { href: '/', name: 'Home' },
  { href: '/json-table/jsph', name: 'JSPH Users' },
  // { href: '/todo2', name: 'To Do2' },
  // { href: '/todo3', name: 'To Do3' },
  
];


export default function Header() {
  return <header>
    <nav className={styles.nav}>
      <ul>
        {pages.map(({ href, name }) =>
          <li key={href}>
            <Link href={href}>{name}</Link></li>)}
      </ul>
    </nav>
  </header>;
}