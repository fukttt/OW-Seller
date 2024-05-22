import { useEffect, useState } from 'react';
import Layer from './components/Layer';
import { IoStarOutline } from "react-icons/io5";

function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

  useEffect(() => {
    fetch('http://127.0.0.1:8000/get_items?token=' + localStorage.getItem("token"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => response.json()).then((r) => {
      setItems(r)
      setLoading(false)
    });
  }, [])
  return (
    <Layer>
      <div className='p-2 flex flex-row gap-4'>
        <div className='bg-[#D9D9D9] py-2 px-6 rounded-md'>
          <p className=' font-semibold text-sm'>ВСЕГО</p>
          <p>{items.length}</p>
        </div>
        <div className='bg-[#D9D9D9] py-2 px-6 rounded-md'>
          <p className=' font-semibold text-sm text-[#CB11AB]'>WB</p>
          <p>{items.filter((it) => it.type === "wb").length}</p>
        </div>
        <div className='bg-[#D9D9D9] py-2 px-6 rounded-md'>
          <p className=' font-semibold text-sm text-[#005BFF]'>OZON</p>
          <p>{items.filter((it) => it.type === "oz").length}</p>
        </div>
      </div>



      {loading ? (
        <div className='flex justify-center items-center py-4'>
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status">
            <span
              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span>
          </div>
        </div>
      ) :
        (
          <div className='grid grid-cols-2 p-2 gap-4'>
            {items.map((it) => (

              <div className='bg-[#D9D9D9] p-4 rounded-md flex flex-row justify-start gap-4'>
                <img className='object-scale-down h-48 rounded-md border-4 border-white' src={it.image} />
                <div className='flex flex-col gap-2 justify-evenly'>
                  <p className='text-lg font-bold'>{it.name.length >= 40 ? it.name.slice(0, 40) + '...' : it.name}</p>
                  {it.type === "wb" ? <p className='text-xs'>{it.desc.slice(0, 180) + '...'}</p> : ""}

                  <div className='flex flex-row gap-4 items-center justify-between'>
                    {/* <div className='flex flex-row gap-2 items-center'>
                  <IoPencilSharp color='#5A8564' className='w-5 h-5' />
                  <IoTrashOutline color='#D10505' className='w-5 h-5' />

                </div> */}
                    <div className='flex flex-row gap-1 items-center'>
                      <IoStarOutline color='#5A8564' className='w-5 h-5 ' />
                      <p>{getRandomInt(3, 5)}</p>
                    </div>
                    <p className='text-xs'><font className="font-semibold">{getRandomInt(0, 26)}</font> отзыва</p>
                    <p className='text-sm'>ID: <font className={(it.type === "oz" ? "text-[#005BFF]" : "text-[#CB11AB]") + " font-semibold"}>{it.id}</font></p>

                  </div>
                </div>
              </div>

            ))}
          </div>
        )


      }


    </Layer >
  );
}

export default Items;
