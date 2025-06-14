
import React from 'react';
import { Button } from "@/components/ui/button";
import { User, Users, MessageSquare, Calendar, CreditCard, Settings } from 'lucide-react';

// Updated to match DashboardTabType in BarberDashboard
type TabType = 'profile' | 'admin' | 'customers' | 'messages' | 'calendar' | 'bank';

interface DashboardNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const DashboardNavigation = ({ activeTab, onTabChange }: DashboardNavigationProps) => {
  const tabs = [
    { id: 'calendar' as TabType, label: 'Schedule', icon: Calendar },
    { id: 'bank' as TabType, label: 'Earnings', icon: CreditCard },
    { id: 'customers' as TabType, label: 'Customers', icon: Users },
    { id: 'messages' as TabType, label: 'Messages', icon: MessageSquare },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'admin' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="w-full lg:w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0">
      <div className="p-2 sm:p-4">
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 text-left justify-start min-w-max lg:w-full ${
                  activeTab === tab.id 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;
