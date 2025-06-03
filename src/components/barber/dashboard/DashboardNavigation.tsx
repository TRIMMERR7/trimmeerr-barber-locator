
import React from 'react';

type TabType = 'profile' | 'customers' | 'messages';

interface NavigationTab {
  id: TabType;
  label: string;
  icon: string;
  description: string;
}

interface DashboardNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const DashboardNavigation = ({ activeTab, onTabChange }: DashboardNavigationProps) => {
  const tabs: NavigationTab[] = [
    { id: 'profile', label: 'My Profile', icon: '👤', description: 'Manage your profile' },
    { id: 'customers', label: 'Discover Customers', icon: '👥', description: 'Find potential clients' },
    { id: 'messages', label: 'Messages', icon: '💬', description: 'Chat with customers' }
  ];

  return (
    <div className="lg:w-64 bg-gray-900 border-b lg:border-r lg:border-b-0 border-gray-800 p-2 lg:p-4 overflow-x-auto lg:overflow-x-visible">
      <div className="flex lg:flex-col gap-1 lg:gap-2 min-w-max lg:min-w-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 lg:w-full p-2 lg:p-3 text-left rounded-lg transition-colors flex items-center gap-2 lg:gap-3 text-xs sm:text-sm lg:text-base ${
              activeTab === tab.id
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span className="text-sm lg:text-lg">{tab.icon}</span>
            <div className="flex flex-col">
              <span className="whitespace-nowrap font-medium">{tab.label}</span>
              <span className="text-xs opacity-70 hidden lg:block">{tab.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardNavigation;
