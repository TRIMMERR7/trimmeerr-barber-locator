
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthHeader from './AuthHeader';

interface AuthContainerProps {
  children: React.ReactNode;
  title: string;
}

const AuthContainer = ({ children, title }: AuthContainerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-6">
        <AuthHeader />

        <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-white text-2xl font-semibold">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthContainer;
