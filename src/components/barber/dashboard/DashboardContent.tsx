
import React from 'react';
import BarberCalendar from '../BarberCalendar';
import NotificationCenter from '../NotificationCenter';
import CustomerDiscovery from '../CustomerDiscovery';
import BankAccountPage from '../BankAccountPage';

interface DashboardContentProps {
  activeTab: string;
  profile: any;
  onUpdateProfile: (profile: any) => void;
  onMessageCustomer: (customerId: string) => void;
}

const DashboardContent = ({ activeTab, profile, onUpdateProfile, onMessageCustomer }: DashboardContentProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BarberCalendar />
              </div>
              <div>
                <NotificationCenter />
              </div>
            </div>
          </div>
        );
      
      case 'customers':
        return <CustomerDiscovery onMessageCustomer={onMessageCustomer} />;
      
      case 'bank':
        return <BankAccountPage />;
      
      default:
        return <BarberCalendar />;
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
};

export default DashboardContent;
