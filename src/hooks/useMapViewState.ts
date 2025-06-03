
import { useState } from 'react';
import { Barber } from '@/data/barberData';

export const useMapViewState = () => {
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const [showAIGeminiPage, setShowAIGeminiPage] = useState(false);
  const [showAboutUsPage, setShowAboutUsPage] = useState(false);
  const [showMenuDialog, setShowMenuDialog] = useState(false);
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([]);

  const handleBarberSelect = (barber: Barber) => {
    console.log('MapView: Barber selected:', barber.name);
    setSelectedBarber(barber);
  };

  const openInAppleMaps = (barber: Barber) => {
    const appleMapsUrl = `https://maps.apple.com/?daddr=${barber.lat},${barber.lng}&dirflg=d&t=m`;
    window.open(appleMapsUrl, '_blank');
  };

  const handleMenuClick = () => {
    setShowMenuDialog(true);
  };

  const handleAIAssistantClick = () => {
    setShowAIGeminiPage(true);
  };

  const handleAboutUsClick = () => {
    setShowAboutUsPage(true);
  };

  return {
    selectedBarber,
    setSelectedBarber,
    showDashboard,
    setShowDashboard,
    showFilterPage,
    setShowFilterPage,
    showAIGeminiPage,
    setShowAIGeminiPage,
    showAboutUsPage,
    setShowAboutUsPage,
    showMenuDialog,
    setShowMenuDialog,
    filteredBarbers,
    setFilteredBarbers,
    handleBarberSelect,
    openInAppleMaps,
    handleMenuClick,
    handleAIAssistantClick,
    handleAboutUsClick
  };
};
