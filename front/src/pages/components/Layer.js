
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { IoLogOut, IoPerson } from "react-icons/io5";

import 'react-toastify/dist/ReactToastify.css';

function Layer(props) {
    const location = useLocation();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');


    useEffect(() => {
        fetch('http://127.0.0.1:8000/check_token?token=' + localStorage.getItem("token"), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json()).then((r) => {
            if (r.status !== "ok") {

                navigate("/login")
            } else {
                setUsername(r.email)
            }
        });
    }, [])
    return (
        <div className="bg-[#D9D9D9]  h-screen p-4">
            {/* NAVBAR  */}
            <div className='flex flex-row justify-between gap-4 items-center w-full bg-white p-4 rounded-md'>

                <div className='flex flex-row gap-4 items-center justify-center'>
                    <div className=''>{/* LOGO  */}
                        <p className=' font-bold'><font className="text-[#005BFF]">O</font><font className="text-[#CB11AB]">W</font> SELLER</p>
                    </div>
                    <a href="/"><button className={(location.pathname == "/" ? " bg-[#5A8564] text-white" : " bg-[#D9D9D9]") + ' rounded-md py-1.5 font-medium px-2'}>Товары</button></a>
                    <a href="/stats"><button className={(location.pathname == "/stats" ? " bg-[#5A8564] text-white" : " bg-[#D9D9D9]") + ' rounded-md py-1.5 font-medium px-2'}>Статистика</button></a>
                    <a href="/settings"><button className={(location.pathname == "/settings" ? " bg-[#5A8564] text-white" : " bg-[#D9D9D9]") + ' rounded-md py-1.5 font-medium px-2'}>Настройки</button></a>
                </div>
                <div className='flex flex-row items-center gap-4 justify-center'>
                    <div className='flex flex-row items-center gap-2'>
                        <IoPerson color="grey" className='w-5 h-5' />
                        <p className='text-[#5A8564] font-bold'>{username}</p>
                    </div>

                    <IoLogOut className='w-5 h-5 cursor-pointer hover:w-6 hover:h-6' onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login")
                    }} />
                </div>



            </div>
            {/* NAVBAR  */}
            <div className=" p-4 bg-white mt-4 rounded-md">

                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                {props.children}
                <ToastContainer />
            </div>
        </div>
    );
}

export default Layer;
