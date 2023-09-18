import jsph from '@/components/gen-json-sources/jsph';
import omdb from '@/components/gen-json-sources/omdb';
import rnm from '@/components/gen-json-sources/rnm';

import { useRouter } from 'next/router';
import MainJsonSource from '../../components/gen-json-sources';

export default function JsonTablePage() {
  const
    router = useRouter(),
    { query: { slug } } = router,
    config = ({ jsph, omdb, rnm })[slug];
  return <MainJsonSource key={slug} config={config} />;
}