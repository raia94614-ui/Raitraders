import React, { useEffect } from 'react';
import { AppRouter } from './app/Router';
import { useContentStore } from './store/contentStore';

export const App: React.FC = () => {
  const initContent = useContentStore((s) => s.initContent);

  useEffect(() => {
    initContent();
  }, [initContent]);

  return <AppRouter />;
};

export default App;
