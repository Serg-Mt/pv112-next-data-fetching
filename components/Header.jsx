import Link from 'next/link';
import styles from './Header.module.css';

const pages = [
  { href: '/', name: 'Home' },
  { href: '/json-table/jsph', name: 'JSPH Users' },
  { href: '/json-table/omdb', name: 'OMDb Films' },
  { href: '/json-table/rnm', name: 'Rick & Morty' },
  { href: '/calendar-demo', name:'Calendar'}
  
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