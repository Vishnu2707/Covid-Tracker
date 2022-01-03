import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Table from "./Table";
import numeral, { options } from "numeral";
import { sortData, prettyPrintStat } from "./util";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setTableData(sortedData);
        });
    };
 
    getCountriesData();
  }, []);

  const getCovidData = async () => {
    const res = await fetch('https://api.covid19india.org/data.json', {
            mode: 'no-cors',
            method: "post",
            headers: {
                 "Content-Type": "application/json"
            },
            body: JSON.stringify(ob)
    });
    const actualData =  await res.json();
    console.log(actualData.statewise);
    setData(actualData.statewise);
  }
  useEffect(() => {
    getCovidData();
  },[]);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h2>COVID-19 TRACKER</h2>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Card className="app__dash">
          <CardContent>
            <div className="app__dashh">
              <div>
                <h2 className="main__head">INDIA COVID-19 DASHBOARD</h2>
                <table>
                  <thead className="head__style">
                    <tr className="app__row">
                      <th className="app__headd">States</th>
                      <th className="app__head">Confirmed</th>
                      <th className="app__head">Recovered</th>
                      <th className="app__head">Deaths</th>
                      <th className="app__head">Active Cases</th>
                      <th className="app__head">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.map((curElem, ind) => {
                        return (
                          <tr key={ind}>
                          <th className="app__state">{curElem.state}</th>
                          <td className="app__data">{numeral(curElem.confirmed).format("0,0")}</td>
                          <td className="app__data">{numeral(curElem.recovered).format("0,0")}</td>
                          <td className="app__data">{numeral(curElem.deaths).format("0,0")}</td>
                          <td className="app__data">{numeral(curElem.active).format("0,0")}</td>
                          <td className="app__data">{curElem.lastupdatedtime}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
        
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <img
              className="app__logo"
              src="http://pngimg.com/uploads/vaccine/vaccine_PNG67.png"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
