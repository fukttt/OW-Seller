import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layer from './components/Layer';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Stats() {

  const [current, setCurrent] = useState('month');
  const [loading, setLoading] = useState(true);

  const [totalsum, setTotalSum] = useState(0);
  const [totalcnt, setTotalCnt] = useState(0);

  const [datawb, setDatawb] = useState([]);
  const [dataoz, setDataoz] = useState([]);
  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  useEffect(() => {
    try {
      fetch('http://127.0.0.1:8000/get_stats?token=' + localStorage.getItem("token"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "delay": current })
      }).then(response => response.json()).then((r) => {
        setLoading(false)
        let full = []
        let full2 = []
        let sum = 0
        let cnt = 0
        if (!r.wb?.date) {
          toast.error('Рейтлимит на стороне WB')
        } else {
          r.wb.date.map((el, index) => {
            full.push({
              name: "wb",
              count: r.wb.metrics[index][0],
              summ: r.wb.metrics[index][1],
              amt: el,
            })
            sum += r.wb.metrics[index][1]
            cnt += r.wb.metrics[index][0]
          })
        }
        if (!r.oz?.date) {
          toast.error('Рейтлимит на стороне OZON')
        } else {
          r.oz.date?.map((el, index) => {
            full2.push({
              name: "wb",
              count: r.oz.metrics[index][1],
              summ: r.oz.metrics[index][0],
              amt: el,
            })
            sum += r.oz.metrics[index][0]
            cnt += r.oz.metrics[index][1]
          })
        }


        setDatawb(full)
        setDataoz(full2)
        setTotalSum(sum)
        setTotalCnt(cnt)

      });
    } catch {
      toast.error('Проблема в получении метрик')
    }

  }, [current])

  return (
    <Layer>
      <div className='p-2 flex flex-col justify-between gap-4'>
        <div className='py-2 px-4 bg-[#D9D9D9] rounded-md flex flex-row justify-start gap-4 '>
          <button className={(current === "today" ? "bg-[#5A8564] text-white font-semibold" : "bg-white") + ' py-1 px-4  rounded-md '} onClick={() => {
            setCurrent('today');
          }}>
            Сегодня
          </button>
          <button className={(current === "week" ? "bg-[#5A8564] text-white font-semibold" : "bg-white") + ' py-1 px-4  rounded-md'} onClick={() => {
            setCurrent('week');
          }}>
            7 дней
          </button>
          <button className={(current === "month" ? "bg-[#5A8564] text-white font-semibold" : "bg-white") + ' py-1 px-4  rounded-md'} onClick={() => {
            setCurrent('month');
          }}>
            Месяц
          </button>
        </div>
        <div className='flex flex-row justify-start gap-4'>
          <div className='bg-[#D9D9D9] p-2 rounded-md'>
            <p className='text-sm'>Кол-во заказов</p>
            <p>{totalsum}</p>
          </div>
          <div className='bg-[#D9D9D9] p-2 rounded-md'>
            <p className='text-sm'>Сумма заказов</p>
            <p>{totalcnt}</p>
          </div>
        </div>

        <div>
          {loading ?
            (<div className='flex justify-center items-center py-4'>
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
                <span
                  className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span>
              </div>
            </div>)
            :
            (
              <div className='grid grid-cols-2 p-6'>
                <div className='flex justify-center'>
                  <AreaChart
                    width={400}
                    height={400}
                    data={datawb}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="amt" label={{
                      value: "Дата",
                      fill: "black",
                      fontWeight: "bolder",
                      dy: 6,
                    }} />
                    <YAxis label={{
                      value: "Сумма и кол-во",
                      position: "insideLeft",
                      fill: "black",
                      fontWeight: "bolder",
                      angle: -90,
                    }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stackId="1" stroke="#CB11AB" fill="#CB11AB" />
                    <Area type="monotone" dataKey="summ" stackId="1" stroke="#CB11AB" fill="#CB11AB" />
                  </AreaChart>
                </div>
                <div className='flex justify-center'>
                  <AreaChart
                    width={400}
                    height={400}
                    data={dataoz}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="amt" label={{
                      value: "Дата",
                      fill: "black",
                      fontWeight: "bolder",
                      dy: 6,
                    }} />
                    <YAxis label={{
                      value: "Сумма и кол-во",
                      position: "insideLeft",
                      fill: "black",
                      fontWeight: "bolder",
                      angle: -90,
                    }} />
                    <Tooltip />
                    <Area type="monotone" tit dataKey="count" stackId="1" stroke="#005BFF" fill="#005BFF" />
                    <Area type="monotone" dataKey="summ" stackId="1" stroke="#005BFF" fill="#005BFF" />
                  </AreaChart>
                </div>
              </div>


            )
          }

        </div>
      </div>
    </Layer >
  );
}

export default Stats;
