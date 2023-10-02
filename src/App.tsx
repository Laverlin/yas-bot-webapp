import { useEffect, useState }  from 'react';
import { TelegramWebApps } from 'telegram-webapps-types';
import AppToolbar from './components/AppToolbar';
import RouteList from './components/RouteList';
import { DefaultYasUser, IYasUser } from './abstract/IYasUser'


const teleApp = (window as any).Telegram?.WebApp as TelegramWebApps.WebApp;


function App() {
  const [yasUser, setYasUser ] = useState<IYasUser>(DefaultYasUser);
  const [tUser, setTUser] = useState<TelegramWebApps.WebAppUser>();

  useEffect(() => {
    teleApp.ready();
    var teleUser = teleApp.initDataUnsafe.user;
    console.log(teleApp);
    setTUser(teleUser);

    const fetchUser = async () => {
      try {
        const response = await fetch(`https://ivan-b.com/api/v2.0/YASail/${tUser?.id}`);
        if (response.ok)
          setYasUser(await response.json());
      }
      catch(e){
        console.log(e);
      }
    };
  
    fetchUser();
    
  }, [tUser]);
  


  return (
    <>
      <AppToolbar userId={ yasUser.publicId } />
      <RouteList userId={ yasUser.publicId } />
      <div>
        all: {JSON.stringify(teleApp.initDataUnsafe)}
        my: {JSON.stringify(tUser)}
      </div>
    </>
  );
}

export default App;
