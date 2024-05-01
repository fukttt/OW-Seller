import Layer from './components/Layer';
import { IoPencilSharp, IoTrashOutline, IoStarOutline } from "react-icons/io5";

function Items() {
  return (
    <Layer>
      <div className='p-2 flex flex-row gap-4'>
        <div className='bg-[#D9D9D9] py-2 px-6 rounded-md'>
          <p className=' font-semibold text-sm'>ВСЕГО</p>
          <p>0</p>
        </div>
        <div className='bg-[#D9D9D9] py-2 px-6 rounded-md'>
          <p className=' font-semibold text-sm text-[#CB11AB]'>WB</p>
          <p>0</p>
        </div>
        <div className='bg-[#D9D9D9] py-2 px-6 rounded-md'>
          <p className=' font-semibold text-sm text-[#005BFF]'>OZON</p>
          <p>0</p>
        </div>
      </div>


      <div className='grid grid-cols-2 p-2 gap-4'>
        <div className='bg-[#D9D9D9] p-4 rounded-md flex flex-row justify-start gap-4'>
          <img className='object-scale-down h-48' src="https://basket-09.wbbasket.ru/vol1243/part124302/124302874/images/c516x688/1.webp" />
          <div className='flex flex-col gap-2 justify-evenly'>
            <p className='text-lg font-bold'>Носки набор 12 пар высокие длинные</p>
            <p className='text-xs'>Комплект разноцветных мужских носков 12 пар и набор из 6 пар из хлопка в красивой упаковке. Мужской набор однотонный цветной отличного качества, с мягкой анатомической резинкой в сочетании с великолепной эластичностью</p>
            <div className='flex flex-row gap-4 items-center justify-between'>
              <div className='flex flex-row gap-2 items-center'>
                <IoPencilSharp color='#5A8564' className='w-5 h-5' />
                <IoTrashOutline color='#D10505' className='w-5 h-5' />

              </div>
              <div className='flex flex-row gap-1 items-center'>
                <IoStarOutline color='#5A8564' className='w-5 h-5 ' />
                <p>5</p>
              </div>
              <p className='text-xs'><font className="font-semibold">103</font> отзыва</p>
              <p className='text-sm'>ID: <font className="font-semibold">234124124</font></p>

            </div>
          </div>
        </div>
        <div className='bg-[#D9D9D9] p-4 rounded-md'> Tovar 22</div>
      </div>
    </Layer>
  );
}

export default Items;
