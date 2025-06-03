
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserType = 'barber' | 'client';

interface AuthContextType {
  user: User | null;
  userType: UserType;
  loading: boolean;
  signOut: () => Promise<void>;
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
  const [userType, setUserType] = useState<UserType>('client');
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
          
          // Set default user type for now
          if (session?.user) {
            setUserType('client'); // Default to client
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
          setUserType('client'); // Default to client
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
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('AuthProvider: Error signing out:', error);
    }
  };

  const value = {
    user,
    userType,
    loading,
    signOut,
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
