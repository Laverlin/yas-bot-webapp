import { useEffect, useState }  from 'react';
import { TelegramWebApps } from 'telegram-webapps-types';
import AppToolbar from './components/AppToolbar';
import RouteList from './components/RouteList';
import { DefaultYasUser, IYasUser } from './abstract/YasUser'


const teleApp = (window as any).Telegram?.WebApp as TelegramWebApps.WebApp;


function App() {
  const [yasUser, setYasUser ] = useState<IYasUser>(DefaultYasUser);

  useEffect(() => {
    teleApp.ready();
    var teleUser = teleApp.initDataUnsafe.user;

    const fetchUser = async () => {
      console.log("fetch user call");
      try {
        const response = await fetch(`https://ivan-b.com/api/v2.0/YASail/${teleUser?.id}`);
        const data = await response.json();
        setYasUser(data);
      }
      catch(e){
        console.log(e);
      }
   };
   if (yasUser.telegramId === DefaultYasUser.telegramId)
      fetchUser();
    
  });
  


  return (
    <>
      <AppToolbar userId={ yasUser.publicId } />
      <RouteList userId={ yasUser.publicId } />
    </>
  );
}

export default App;
