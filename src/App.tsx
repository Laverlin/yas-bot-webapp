import { useEffect }  from 'react';
import logo from './logo.svg';
import './App.css';
import { TelegramWebApps } from 'telegram-webapps-types';



//const tele = window.Telegram.WebApp;

const teleApp = (window as any).Telegram?.WebApp as TelegramWebApps.WebApp;


export interface ITelegramContext {
  webApp?: TelegramWebApps.WebApp;
  user?: TelegramWebApps.WebAppUser;
}



function App() {
  useEffect(() => {
    teleApp.ready();
  });

  const teleUser = teleApp.initDataUnsafe.user;

  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          ID: {teleUser?.id}
        </p>

      </header>
    </div>
  );
}

export default App;
