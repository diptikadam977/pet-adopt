
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });

      if (error) throw error;
      setIsAdmin(data);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const makeUserAdmin = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('exec_sql', {
        query: `INSERT INTO public.user_roles (user_id, role) VALUES ('${userId}', 'admin') ON CONFLICT (user_id, role) DO NOTHING`
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error making user admin:', error);
      return { success: false, error };
    }
  };

  return {
    isAdmin,
    loading,
    makeUserAdmin,
    checkAdminStatus
  };
}
