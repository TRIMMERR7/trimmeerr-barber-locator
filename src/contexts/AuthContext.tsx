
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
    console.log('AuthProvider: Initializing...');
    
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log('AuthProvider: Loading timeout reached, forcing completion');
      setLoading(false);
    }, 8000); // 8 second timeout

    // Get initial session
    const getSession = async () => {
      try {
        console.log('AuthProvider: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Error getting session:', error);
        } else {
          console.log('AuthProvider: Initial session:', !!session?.user);
          setUser(session?.user ?? null);
          
          // Get user type from metadata or localStorage
          if (session?.user) {
            const storedUserType = localStorage.getItem('userType') as UserType;
            const metadataUserType = session.user.user_metadata?.user_type as UserType;
            const finalUserType = metadataUserType || storedUserType || 'client';
            console.log('AuthProvider: Setting user type to:', finalUserType);
            setUserTypeState(finalUserType);
          }
        }
      } catch (error) {
        console.error('AuthProvider: Exception getting session:', error);
      } finally {
        console.log('AuthProvider: Session check complete');
        clearTimeout(loadingTimeout);
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed:', event, !!session?.user);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const storedUserType = localStorage.getItem('userType') as UserType;
          const metadataUserType = session.user.user_metadata?.user_type as UserType;
          const finalUserType = metadataUserType || storedUserType || 'client';
          console.log('AuthProvider: Setting user type to:', finalUserType);
          setUserTypeState(finalUserType);
        }
        
        if (!loading) {
          clearTimeout(loadingTimeout);
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('AuthProvider: Cleaning up...');
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('AuthProvider: Signing out...');
    localStorage.removeItem('userType');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('AuthProvider: Error signing out:', error);
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

  console.log('AuthProvider: Rendering with state:', { 
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
