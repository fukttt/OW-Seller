
import { useLocation } from 'react-router-dom'

function Layer(props) {
    const location = useLocation();

    return (
        <div className="bg-[#D9D9D9]  h-screen p-4">
            {/* NAVBAR  */}
            <div className='flex flex-row justify-start gap-4 items-center w-full bg-white p-4 rounded-md'>
                <div className=''>{/* LOGO  */}
                    <p className=' font-bold'><font className="text-[#005BFF]">O</font><font className="text-[#CB11AB]">W</font> SELLER</p>
                </div>
                <div className='flex flex-row gap-4 items-center justify-center'>
                    <a href="/"><button className={(location.pathname == "/" ? " bg-[#5A8564] text-white" : " bg-[#D9D9D9]") + ' rounded-md py-1.5 font-medium px-2'}>Товары</button></a>
                    <a href="/stats"><button className={(location.pathname == "/stats" ? " bg-[#5A8564] text-white" : " bg-[#D9D9D9]") + 'bg-[#D9D9D9] rounded-md py-1.5 font-medium px-2'}>Статистика</button></a>
                    <a href="/settings"><button className={(location.pathname == "/settings" ? " bg-[#5A8564] text-white" : " bg-[#D9D9D9]") + 'bg-[#D9D9D9] rounded-md py-1.5 font-medium px-2'}>Настройки</button></a>
                </div>


            </div>
            {/* NAVBAR  */}
            <div className=" p-4 bg-white mt-4 rounded-md">
                {props.children}
            </div>
        </div>
    );
}

export default Layer;
