
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
    
    let isMounted = true;

    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (isMounted) {
        console.log('AuthProvider: Loading timeout reached, forcing completion');
        setLoading(false);
      }
    }, 10000);

    // Listen for auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('AuthProvider: Auth state changed:', event, !!session?.user);
        
        if (session?.user) {
          setUser(session.user);
          
          // Get user type from metadata or localStorage
          const storedUserType = localStorage.getItem('userType') as UserType;
          const metadataUserType = session.user.user_metadata?.user_type as UserType;
          const finalUserType = metadataUserType || storedUserType || 'client';
          console.log('AuthProvider: Setting user type to:', finalUserType);
          setUserTypeState(finalUserType);
          
          // Store the user type for future sessions
          localStorage.setItem('userType', finalUserType);
        } else {
          setUser(null);
          setUserTypeState('client');
          localStorage.removeItem('userType');
        }
        
        if (isMounted) {
          clearTimeout(loadingTimeout);
          setLoading(false);
        }
      }
    );

    // Get initial session
    const getSession = async () => {
      if (!isMounted) return;
      
      try {
        console.log('AuthProvider: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Error getting session:', error);
        } else if (session?.user && isMounted) {
          console.log('AuthProvider: Initial session found:', !!session.user);
          setUser(session.user);
          
          // Get user type from metadata or localStorage
          const storedUserType = localStorage.getItem('userType') as UserType;
          const metadataUserType = session.user.user_metadata?.user_type as UserType;
          const finalUserType = metadataUserType || storedUserType || 'client';
          console.log('AuthProvider: Setting user type to:', finalUserType);
          setUserTypeState(finalUserType);
          
          // Store the user type for future sessions
          localStorage.setItem('userType', finalUserType);
        }
      } catch (error) {
        console.error('AuthProvider: Exception getting session:', error);
      } finally {
        if (isMounted) {
          console.log('AuthProvider: Session check complete');
          clearTimeout(loadingTimeout);
          setLoading(false);
        }
      }
    };

    getSession();

    return () => {
      isMounted = false;
      console.log('AuthProvider: Cleaning up...');
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('AuthProvider: Signing out...');
    localStorage.removeItem('userType');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider: Error signing out:', error);
      }
    } catch (error) {
      console.error('AuthProvider: Exception during sign out:', error);
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
