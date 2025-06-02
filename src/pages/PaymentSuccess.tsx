
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Receipt, Calendar, Loader2 } from "lucide-react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const sessionId = searchParams.get('session_id');
  const barberName = searchParams.get('barber');
  const appointmentTime = searchParams.get('time');

  useEffect(() => {
    const sendConfirmation = async () => {
      if (!user?.email || !barberName || !appointmentTime || confirmationSent) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Sending booking confirmation...');
        
        // Get user phone from profile if available
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone')
          .eq('id', user.id)
          .single();

        const { data, error } = await supabase.functions.invoke('send-booking-confirmation', {
          body: {
            email: user.email,
            barberName: decodeURIComponent(barberName),
            appointmentTime: decodeURIComponent(appointmentTime),
            amount: 3500, // This should come from the payment data in a real app
            userPhone: profile?.phone || ''
          }
        });

        if (error) {
          console.error('Confirmation error:', error);
          toast({
            title: "Confirmation Error",
            description: "Appointment booked but confirmation failed to send",
            variant: "destructive",
          });
        } else {
          console.log('Confirmation sent:', data);
          setConfirmationSent(true);
          toast({
            title: "Confirmation Sent",
            description: "Email and SMS confirmations have been sent",
          });
        }
      } catch (error) {
        console.error('Confirmation sending failed:', error);
        toast({
          title: "Notification Error",
          description: "Appointment confirmed but notifications failed",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    sendConfirmation();
  }, [user, barberName, appointmentTime, confirmationSent, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Appointment Booked!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Your barber service payment has been processed successfully. Your appointment is confirmed!
            </p>
            
            {barberName && appointmentTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Appointment Details</span>
                </div>
                <p className="text-sm text-blue-700">
                  <strong>Barber:</strong> {decodeURIComponent(barberName)}
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Time:</strong> {decodeURIComponent(appointmentTime)}
                </p>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
              {isLoading ? (
                <div className="flex items-center gap-2 justify-center text-yellow-800">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending confirmations...</span>
                </div>
              ) : confirmationSent ? (
                <div className="text-yellow-800">
                  <div className="flex items-center gap-2 justify-center mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Confirmations Sent!</span>
                  </div>
                  <p>Check your email and phone for appointment details.</p>
                </div>
              ) : (
                <div className="text-yellow-800">
                  <div className="flex items-center gap-2 justify-center mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Appointment Confirmed</span>
                  </div>
                  <p>Your appointment has been successfully booked.</p>
                </div>
              )}
            </div>

            {sessionId && (
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <div className="flex items-center gap-1 justify-center">
                  <Receipt className="w-3 h-3" />
                  <span>Reference: {sessionId.slice(-8)}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              Return to App
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
