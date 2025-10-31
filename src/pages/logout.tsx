import { logout } from '@/hooks/useSession';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function LogoutPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const executeLogout = async () => {
    try {
      setLoading(true);
      await logout();
      router.push('/');
      return;
    } catch (error) {
      setError(String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeLogout();
  });

  if (!loading && error) return <>{error}</>;

  return <>Cargando...</>;
}
