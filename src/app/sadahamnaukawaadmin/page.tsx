import { cookies } from 'next/headers';
import AdminClient from './AdminClient';
import { verifyAdminToken } from '@/actions/lanternActions';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');
  
  const isAuthenticated = !!(sessionCookie && (await verifyAdminToken(sessionCookie.value)));

  return <AdminClient initialIsAuthenticated={isAuthenticated} />;
}
