import { useEffect, useState } from 'react';
import Layer from './components/Layer';
import { IoPencilSharp, IoTrashOutline, IoStarOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
function Settings() {
  const [settings, setSettings] = useState({});
  const sendSeetings = () => {
    fetch('http://127.0.0.1:8000/set_setting?token=' + localStorage.getItem("token"), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "wb_token": "string",
        "ozon_token": "string",
        "email": "string",
        "password": "string"
      })
    }).then(response => response.json()).then((r) => {
      setSettings(r)
    });
  }
  useEffect(() => {
    fetch('http://127.0.0.1:8000/get_setting?token=' + localStorage.getItem("token"), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => response.json()).then((r) => {
      setSettings(r);

    });
  }, [])
  return (
    <Layer>
      <div className='p-2 flex flex-row gap-4'>
        <h1 className=' font-bold'>Настройки пользователя</h1>
      </div>
      <div className='flex flex-col w-1/2 px-2 gap-2'>
        <input className='p-2 bg-[#D9D9D9] rounded-md' type='text' placeholder='API-ключ WILDBERRIES' value={settings.wb_token} onChange={e => { setSettings((old) => ({ ...old, wb_token: e.target.value })) }} />
        <input className='p-2 bg-[#D9D9D9] rounded-md' placeholder='API-ключ OZON' value={settings.oz_token} onChange={e => { setSettings((old) => ({ ...old, oz_token: e.target.value })) }} />
        <input className='p-2 bg-[#D9D9D9] rounded-md' placeholder='Email' value={settings.email} onChange={e => { setSettings((old) => ({ ...old, email: e.target.value })) }} />
        <input className='p-2 bg-[#D9D9D9] rounded-md' placeholder='Пароль' type="password" onChange={e => { setSettings((old) => ({ ...old, password: e.target.value })) }} />


      </div>
      <div className='flex px-2 py-2'>
        <button className='bg-[#5A8564] p-2 rounded-md text-white' onClick={() => {
          console.log(settings)
          fetch('http://127.0.0.1:8000/set_settings?token=' + localStorage.getItem("token"), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
          }).then(response => response.json()).then((r) => {
            if (r.status && r.status === "ok") {
              toast.success('🦄 Настройки сохранены!');
            } else {
              toast.error('🦄 Что-то не так!');
            }
          });
        }}>Сохранить</button>
      </div>

    </Layer>
  );
}

export default Settings;
