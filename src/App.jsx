import { useEffect, useState } from 'react'
import './App.css'
import moment from 'moment';
import axios from 'axios';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


function App() {
  const [allData, setAllData] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format('YYYY-MM-DD'));
  const [toDate, setToDate] = useState(moment().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true)
    const params = {
      from: fromDate || moment().subtract(2, 'days').format('YYYY-MM-DD'),
      to: toDate || moment().format('YYYY-MM-DD'),
      page: 1,
      per_page: 100,
    }
    let props = "";
    for (const key in params) {
      if (Object.hasOwnProperty.call(params, key)) {
        const element = params[key];
        props += `${key}=${element}&`;
      }
    }
    const url = `https://www.nrb.org.np/api/forex/v1/rates?${props}`;
    axios.get(url).then(res => {
      setAllData(res.data.data?.payload)
      setLoading(false)
    })
  }, [fromDate, toDate])

  return (
    <div className='px-[5vw] py-5'>
      <h2 className="text-center text-4xl font-semibold">Foriegn Exchange Rates</h2>
      <div className='flex gap-10 my-4'>
        <ReactDatePicker selectsEnd
          showIcon
          className="border"
          endDate={new Date()} selected={fromDate} onChange={(date) => setFromDate(moment(date).format('YYYY-MM-DD'))} />
        <ReactDatePicker className="border" showIcon selected={toDate} onChange={(date) => setToDate(moment(date).format('YYYY-MM-DD'))} />
      </div>

      {
        loading ? "Loading..." : allData.map((rates, key) => {
          return <div key={key}>
            <p className='flex gap-6 text-sm'>
              <span>Published On: {moment(rates.published_on).format('YYYY-MM-DD hh:mm:ss')}</span>
              <span>Modified On: {rates.modified_on}</span>
            </p>
            <div className='flex flex-col my-5'>
              <div className='grid grid-cols-[1fr_1fr_1fr_1fr_1fr] w-full'>
                <p className="font-semibold py-2">SN</p>
                <p className="font-semibold py-2">CURRENCY</p>
                <p className="font-semibold py-2">UNIT</p>
                <p className="font-semibold py-2">BUY</p>
                <p className="font-semibold py-2">SELL</p>
                {
                  rates.rates.map((rate, rateKey) => {
                    return (
                      <>
                        <p className='py-1'>{rateKey + 1}</p>
                        <p className='py-1'>{rate.currency.name} ({rate.currency.iso3})</p>
                        <p className='py-1'>{rate.currency.unit}</p>
                        <p className='py-1'>{rate.buy}</p>
                        <p className='py-1'>{rate.sell}</p>
                      </>

                    )
                  })
                }
              </div>
            </div>
          </div>
        })
      }
    </div>
  )
}

export default App
