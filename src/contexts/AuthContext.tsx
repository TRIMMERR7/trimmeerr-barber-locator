
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

  console.log('AuthProvider: Initializing...');

  useEffect(() => {
    console.log('AuthProvider: Setting up auth listener...');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('AuthProvider: Initial session check:', !!session, error);
        
        if (session?.user) {
          setUser(session.user);
          const storedUserType = localStorage.getItem('userType') as UserType;
          const metadataUserType = session.user.user_metadata?.user_type as UserType;
          const finalUserType = metadataUserType || storedUserType || 'client';
          setUserTypeState(finalUserType);
          localStorage.setItem('userType', finalUserType);
          console.log('AuthProvider: User found, type:', finalUserType);
        } else {
          setUser(null);
          setUserTypeState('client');
          localStorage.removeItem('userType');
          console.log('AuthProvider: No user found');
        }
      } catch (error) {
        console.error('AuthProvider: Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthProvider: Auth state changed:', event, !!session);
        
        if (session?.user) {
          setUser(session.user);
          const storedUserType = localStorage.getItem('userType') as UserType;
          const metadataUserType = session.user.user_metadata?.user_type as UserType;
          const finalUserType = metadataUserType || storedUserType || 'client';
          setUserTypeState(finalUserType);
          localStorage.setItem('userType', finalUserType);
        } else {
          setUser(null);
          setUserTypeState('client');
          localStorage.removeItem('userType');
        }
        
        setLoading(false);
      }
    );

    getInitialSession();

    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('AuthProvider: Signing out...');
    
    try {
      localStorage.removeItem('userType');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider: Sign out error:', error);
      } else {
        console.log('AuthProvider: Sign out successful');
        // The auth state change listener will handle setting user to null
        // and the Index component will automatically show the login page
      }
    } catch (error) {
      console.error('AuthProvider: Sign out exception:', error);
    }
  };

  const setUserType = (type: UserType) => {
    console.log('AuthProvider: Setting user type to:', type);
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
