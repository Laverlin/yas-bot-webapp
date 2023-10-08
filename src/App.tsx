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
      FetchUser(teleUser?.id ?? Number(process.env.REACT_APP_FALLBACK_UID))
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
