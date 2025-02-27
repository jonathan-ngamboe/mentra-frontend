import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function NotFound() {
  const headersList = await headers();
  const cookie = headersList.get('cookie');
  const locale = cookie?.includes('NEXT_LOCALE=fr') ? 'fr' : 'en';
  
  redirect(`/${locale}/404`);
}