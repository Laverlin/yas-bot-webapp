import { useEffect }  from 'react';
import './App.css';
import { TelegramWebApps } from 'telegram-webapps-types';
import AppToolbar from './components/AppToolbar';
import RouteList from './components/RouteList';


const teleApp = (window as any).Telegram?.WebApp as TelegramWebApps.WebApp;


function App() {
  useEffect(() => {
    teleApp.ready();
  });

  
  var teleUser = teleApp.initDataUnsafe.user;


  return (
    <>
      <AppToolbar userId={teleUser?.id ?? 0} />
      <RouteList userId={teleUser?.id ?? 0} />
    </>
  );
}

export default App;
