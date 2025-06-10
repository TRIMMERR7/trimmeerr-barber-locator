
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserType = 'barber' | 'client';

interface AuthContextType {
  user: User | null;
  userType: UserType;
  loading: boolean;
  signOut: () => Promise<void>;
  setUserType: (type: UserType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserTypeState] = useState<UserType>('client');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Starting initialization...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth event:', event, !!session?.user);
        
        if (session?.user) {
          setUser(session.user);
          
          // Get user type from metadata or localStorage
          const storedUserType = localStorage.getItem('userType') as UserType;
          const metadataUserType = session.user.user_metadata?.user_type as UserType;
          const finalUserType = metadataUserType || storedUserType || 'client';
          
          console.log('AuthProvider: Setting user type to:', finalUserType);
          setUserTypeState(finalUserType);
          localStorage.setItem('userType', finalUserType);
        } else {
          console.log('AuthProvider: No user, clearing state');
          setUser(null);
          setUserTypeState('client');
          localStorage.removeItem('userType');
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('AuthProvider: Found existing session');
          setUser(session.user);
          
          const storedUserType = localStorage.getItem('userType') as UserType;
          const metadataUserType = session.user.user_metadata?.user_type as UserType;
          const finalUserType = metadataUserType || storedUserType || 'client';
          
          console.log('AuthProvider: Initial user type:', finalUserType);
          setUserTypeState(finalUserType);
          localStorage.setItem('userType', finalUserType);
        } else {
          console.log('AuthProvider: No existing session');
        }
      } catch (error) {
        console.error('AuthProvider: Exception during initialization:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup subscription
    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('AuthProvider: Signing out...');
    setLoading(true);
    
    try {
      localStorage.removeItem('userType');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider: Sign out error:', error);
      }
    } catch (error) {
      console.error('AuthProvider: Sign out exception:', error);
    } finally {
      setLoading(false);
    }
  };

  const setUserType = (type: UserType) => {
    console.log('AuthProvider: Manually setting user type to:', type);
    setUserTypeState(type);
    localStorage.setItem('userType', type);
  };

  const value = {
    user,
    userType,
    loading,
    signOut,
    setUserType,
  };

  console.log('AuthProvider: Current state:', { 
    hasUser: !!user, 
    userType, 
    loading 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
