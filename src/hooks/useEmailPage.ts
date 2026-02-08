import { useState } from 'react';

export type TabType = 'grid' | 'template-grid';

export const useEmailPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('template-grid');

  return {
    activeTab,
    setActiveTab
  };
};
