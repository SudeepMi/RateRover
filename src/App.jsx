import { useEffect, useState } from 'react'
import './App.css'
import moment from 'moment';
import axios from 'axios';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



function App() {
  const [allData, setAllData] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format('YYYY-MM-DD'));
  const [toDate, setToDate] = useState(moment().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [activeData, setActiveData] = useState({});

  function extractRateDetails(rates) {
    
    const dates = [];
    const buyPrices = [];
    const sellPrices = [];
    if(rates){
      rates.forEach(rate => {
        dates.push(rate.date);
        buyPrices.push(rate.buy);
        sellPrices.push(rate.sell);
      });
    }
  
    return { dates, buyPrices, sellPrices };
  }
  

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Currency Rate Graph",
      },
    },
  };
  const data = {
    labels: extractRateDetails(activeData?.rates).dates,
    datasets: [
      {
        label: "Sale",
        data:extractRateDetails(activeData?.rates).sellPrices ,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: `Buy`,
        data: extractRateDetails(activeData?.rates).buyPrices,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const extra = {
    "currency_symbols": {
      "INR": "₹",
      "USD": "$",
      "EUR": "€",
      "GBP": "£",
      "CHF": "CHF",
      "AUD": "A$",
      "CAD": "C$",
      "SGD": "S$",
      "JPY": "¥",
      "CNY": "¥",
      "SAR": "ر.س",
      "QAR": "ر.ق",
      "THB": "฿",
      "AED": "د.إ",
      "MYR": "RM",
      "KRW": "₩",
      "SEK": "kr",
      "DKK": "kr",
      "HKD": "HK$",
      "KWD": "د.ك",
      "BHD": "د.ب"
    },
    "currency_flags": {
      "INR": "https://www.countryflags.com/wp-content/uploads/india-flag-png-large.png",
      "USD": "https://www.countryflags.com/wp-content/uploads/united-states-of-america-flag-png-large.png",
      "EUR": "https://www.countryflags.com/wp-content/uploads/europe-flag-jpg-xl.jpg",
      "GBP": "https://www.countryflags.com/wp-content/uploads/united-kingdom-flag-png-large.png",
      "CHF": "https://www.countryflags.com/wp-content/uploads/switzerland-flag-png-large.png",
      "AUD": "https://www.countryflags.com/wp-content/uploads/flag-jpg-xl-9-2048x1024.jpg",
      "CAD": "https://www.countryflags.com/wp-content/uploads/canada-flag-png-large.png",
      "SGD": "https://www.countryflags.com/wp-content/uploads/singapore-flag-png-large.png",
      "JPY": "https://www.countryflags.com/wp-content/uploads/japan-flag-png-large.png",
      "CNY": "https://www.countryflags.com/wp-content/uploads/china-flag-png-large.png",
      "SAR": "https://www.countryflags.com/wp-content/uploads/saudi-arabia-flag-png-large.png",
      "QAR": "https://www.countryflags.com/wp-content/uploads/qatar-flag-png-large.png",
      "THB": "https://www.countryflags.com/wp-content/uploads/thailand-flag-png-large.png",
      "AED": "https://www.countryflags.com/wp-content/uploads/united-arab-emirates-flag-png-large.png",
      "MYR": "https://www.countryflags.com/wp-content/uploads/malaysia-flag-png-large.png",
      "KRW": "https://www.countryflags.com/wp-content/uploads/south-korea-flag-png-large.png",
      "SEK": "https://www.countryflags.com/wp-content/uploads/sweden-flag-png-large.png",
      "DKK": "https://www.countryflags.com/wp-content/uploads/denmark-flag-png-large.png",
      "HKD": "https://www.countryflags.com/wp-content/uploads/hongkong-flag-jpg-xl.jpg",
      "KWD": "https://www.countryflags.com/wp-content/uploads/kuwait-flag-png-large.png",
      "BHD": "https://www.countryflags.com/wp-content/uploads/flag-jpg-xl-13-2048x1229.jpg"
    }
  }


  useEffect(() => {
    setLoading(true)
    const params = {
      from: fromDate || moment().subtract(10, 'days').format('YYYY-MM-DD'),
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
      if(active){
        handleActiveItems(res.data.data?.payload, active);
      }
      setLoading(false)
    })
  }, [fromDate, toDate])


  const handleActiveItems = (allCurrency, active)=>{
    const grouped = groupRatesByCurrency(allCurrency);
    setActiveData(grouped[active]);

  }

  useEffect(()=>{
    if(active){
    setLoading(true)
    const params = {
      from:  moment().subtract(10, 'days').format('YYYY-MM-DD'),
      to:  moment().format('YYYY-MM-DD'),
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
     handleActiveItems(res.data?.data?.payload, active);
      setLoading(false)
    })
    }
  },[active])



  function groupRatesByCurrency(data) {
    // Create an empty object to hold the grouped rates
    const groupedRates = {};
    // Loop through each entry in the data array
    data.forEach(entry => {
      // Loop through each rate in the entry
      entry.rates.forEach(rate => {
        const currencyCode = rate.currency.iso3;
        
        // If the currency code is not yet a key in the groupedRates object, add it
        if (!groupedRates[currencyCode]) {
          groupedRates[currencyCode] = {
            name: rate.currency.name,
            unit: rate.currency.unit,
            rates: []
          };
        }
  
        // Add the rate information to the corresponding currency key
        groupedRates[currencyCode].rates.push({
          date: entry.date,
          buy: rate.buy,
          sell: rate.sell
        });
      });
    });
  
    return groupedRates;
  }

  return (
    <div className='px-[5vw] py-5'>
      {console.log(activeData)}
      <h2 className="text-center text-4xl font-semibold">Foriegn Exchange Rates</h2>
     {active && <div className='flex gap-10 my-4'>
        <ReactDatePicker selectsEnd
          showIcon
          className="border"
          endDate={new Date()} selected={fromDate} onChange={(date) => setFromDate(moment(date).format('YYYY-MM-DD'))} />
        <ReactDatePicker className="border" showIcon selected={toDate} onChange={(date) => setToDate(moment(date).format('YYYY-MM-DD'))} />
        <button onClick={()=>setActive(null)} className=" bg-slate-400 text-white text-sm rounded px-4">BACK</button>
      </div>}
      {
        loading ? "Loading..." : !active ? allData.map((rates, key) => {
          return <div key={key}>
            <p className='flex gap-6 text-sm'>
              <span>Published On: {moment(rates.published_on).format('YYYY-MM-DD hh:mm:ss')}</span>
              <span>Modified On: {rates.modified_on}</span>
            </p>
            <div className='flex flex-col my-5'>
              <div className='grid grid-cols-[1fr_1fr_1fr_1fr] w-full gap-3'>
                {
                  rates.rates.map((rate, rateKey) => {
                    return (
                      <div key={rateKey} className="border rounded p-2 shadow cursor-pointer hover:bg-slate-100" onClick={()=>setActive(rate.currency.iso3)}>
                        <div className='flex items-center justify-between font-bold text-red-400'>
                          <div className='gap-2 flex items-center'>
                            <p className=''>{rate.currency.iso3}</p>
                            <p className='py-1'>{extra.currency_symbols[rate.currency.iso3]}{rate.currency.unit}</p>
                          </div>
                          <img src={extra.currency_flags[rate.currency.iso3]} width={"30px"} />
                        </div>
                        <p className='text-sm'>{rate.currency.name}</p>
                        <div className='flex justify-between border-t-2 pt-2'>
                          <span className='grid grid-cols-1'>
                            <p className='text-sm'>BUY</p>
                            <p className='text-green-400'>NPR.{rate.buy}</p>
                          </span>
                          <span className='grid grid-cols-1'>
                            <p  className='text-sm '>SALE</p>
                            <p className='text-red-400'>NPR.{rate.sell}</p>
                          </span>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        }) : activeData ? <div className='grid grid-cols-[2fr_3fr] w-full'>
          <div  className='p-5'>
          <img src={extra.currency_flags[active]} width={"100px"} />
          <h2 className='text-3xl'>{activeData.name}</h2>
          <p className='text-3xl'>{extra.currency_symbols[active]}{activeData.unit}</p>
          <p>Last 10 Days Rates</p>
          </div>
          <div>
          <Line options={options} data={data} />
          </div>
        </div> : "Data Not Found"
      }
    </div>
  )
}

export default App
