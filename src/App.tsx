import { useEffect, useState }  from 'react';
import { TelegramWebApps } from 'telegram-webapps-types';
import AppToolbar from './components/AppToolbar';
import RouteList from './components/RouteList';
import { DefaultYasUser, IYasUser } from './abstract/IYasUser'
import { FetchUser } from './utils/fetcher';

const teleApp = (window as any).Telegram?.WebApp as TelegramWebApps.WebApp;

function App() {
    const [yasUser, setYasUser ] = useState<IYasUser>(DefaultYasUser);

    useEffect(() => {
      teleApp.ready();
      var teleUser = teleApp.initDataUnsafe.user;
      var fallbackTid = window.location.hash.length > 0 ? window.location.hash.replace('#', '') : process.env.REACT_APP_FALLBACK_UID;
      FetchUser(teleUser?.id ?? Number(fallbackTid))
        .then(yasUser => setYasUser(yasUser));
    }, []);

    return (
      <>
        <AppToolbar token={ yasUser.publicId } />
        <RouteList token={ yasUser.publicId } />
      </>
    );
}

export default App;
