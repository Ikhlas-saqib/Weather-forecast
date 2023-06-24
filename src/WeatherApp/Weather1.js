import React, { useState } from "react";
import "./Weather1.css";
import creds from "./creds.json";

function Weather1() {
  const [dataAll, setData] = useState({});
  const [base, setBase] = useState({});
  const [cords, setCords] = useState({});
  const [search, setSearch] = useState();
  const [hourly, setHourly] = useState([]);
  const [daily, setDaily] = useState([]);
  const [showDaily, setShowDaily] = useState(true);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search !== "") {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${creds.api}`;

      fetch(url)
        .then((res) => {
          return res.json();
        })
        .then(displayCoords)
        .then(handleHourly);
    } else {
      alert("Enter a valid location");
    }
  };

  function displayCoords(res) {
    setCords(res.coord);
    setBase(res);
    console.log(cords);
    console.log(base);
  }

  const api = creds.api;
  const BASE_URL =`https://api.openweathermap.org/data/2.5/onecall?lat=${cords.lat}&lon=${cords.lon}&units=imperial&exclude=minutely&appid=${api}`
  
  

  function displayResults(res) {
    setData(res);
    setHourly(dataAll.hourly);
    setDaily(res.daily);
    console.log(res);
    console.log(hourly);
    console.log(daily);
  }

  const handleHourly = () => {
    
    fetch(BASE_URL)
      .then((res) => {
        return res.json();
      })
      .then(displayResults)
      .catch((err) => console.log("Error: ", err));
  };

  const handleDaily = () => {
    setShowDaily((show) => !show);
  };

 

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function displayDay(d) {
    var date = new Date(d * 1000);
    return days[date.getDay()];
  }

  

  function displayDate(d) {
    var date = new Date(d * 1000);
    var years = date.getFullYear();
    var month = months[date.getMonth()];
    var day = date.getDate();

    var formattedDate = day + " " + month + " " + years;
    return formattedDate;
  }

  return (
    <div className="weather">
      <div className="weather-container">
        <div className="weather-search">
          <form onSubmit={handleSubmit}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter a location"
            />
            
            <button onClick={handleSubmit} type="submit">
              Search
            </button>
          </form>
        </div>
        <p style={{color:'red'}}>INFO:- Press Twice a Enter to show the Complete Details</p>
        <div className="weather-current">
          <h4>
            {base.name}, {base.sys?.country}
          </h4>
          <small>{displayDate(base.dt)}</small>
          <div className="weather-info">
            <div className="weather-icon">
              <img
                src={
                  base?.weather &&
                  `https://openweathermap.org/img/wn/${base?.weather[0]?.icon}@2x.png`
                }
                alt=""
              />
            </div>
            <div className="weather-temp">
              <p>
                {parseInt(base.main?.temp) - (273.15).toFixed()}
                <sup>°c</sup>
              </p>
              
            </div>
    
          </div>
        </div>
        <div className="weather-daily-content">
          <div onClick={handleDaily} className="weather-hourly-data">
            <p>See daily weather report</p>
            <div className="drop">
              
            </div>
          </div>
          <div className="weather-daily-container">
            {showDaily &&
              daily?.map((_daily) => (
                <>
                  <div className="weather-daily-info">
                  <p>{displayDay(_daily.dt)}</p>
                    <img
                      src={`http://openweathermap.org/img/wn/${_daily.weather[0].icon}@2x.png
                      `}
                      alt=""
                    />
                    <div className="weather-min-max">
                      <div className="weather-max">
                      
                        <p>
                          {parseInt(_daily.temp.max).toFixed()}
                          <sup>°c</sup>
                        </p>
                      </div>
                      <div className="weather-max">
                       
                        <p>
                          {parseInt(_daily.temp.min).toFixed()}
                          <sup>°c</sup>
                        </p>
                      </div>
                    </div>
                    
                    <p>{_daily.weather && _daily.weather[0].description}</p>
                  </div>
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather1;