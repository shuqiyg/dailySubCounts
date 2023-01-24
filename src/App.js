import React, {useState, useEffect} from 'react';
import bb, {area, bar} from "billboard.js";
import { Providers } from '@microsoft/mgt-element';
import { Msal2Provider } from '@microsoft/mgt-msal2-provider';
import {Login} from '@microsoft/mgt-react';
import axios from 'axios';
import './App.css';

Providers.globalProvider = new Msal2Provider({
  clientId: '25678cb4-b6d3-47d7-aa68-9661a11e3468'
});

function App() {
  let [dailyCounts, setDailyCounts] = useState([]);
  let [totalSubCounts, setTotalSubCounts] = useState();
  //create 10 different time slots, and generate an array of time of creating the submissions
  let timeSlots = [];
  let x = 0;
  while(x < 10){
    timeSlots.push([]);
    x++;
  }


  //group of submission creators
  let creators = [];
  //create counts per time slot for every creator
  let subCountsByCreators = [];

  //fetch real time data(submission created time, creator) from submissionapi
  useEffect(()=>{
    axios.get("http://apps6.amfredericks.com/submissionapi/dailyCount")
  .then((response)=>{
    setDailyCounts(response.data);
    //console.log(response.data.length);
    setTotalSubCounts(response.data.length);
  })},[])
  console.log(totalSubCounts)
  //loop through the fetched time data from apps6 API, poplulate the times for each array
  dailyCounts.forEach(submission=>{
    if(!creators.includes(submission.first_name)){
      creators.push(submission.first_name);
      let subCounts = [];
      subCounts[0] = submission.first_name;
      for(let i = 1; i < 11; i++){
        subCounts[i] = 0;
      }
      subCountsByCreators.push(subCounts);
    }else{
      subCountsByCreators.forEach((subCounts)=>{

      })
    }

    let time = submission.creationTime.slice(submission.creationTime.indexOf("T")+1)
    time = time.slice(0, 8)
    if(time <'09:00:00'){
      timeSlots[0].push(submission);
    }else if(time <'10:00:00'){
      timeSlots[1].push(submission);
    }else if(time < '11:00:00'){
      timeSlots[2].push(submission);
    }else if(time < '12:00:00'){
      timeSlots[3].push(submission);
    }else if(time < '13:00:00'){
      timeSlots[4].push(submission);
    }else if(time < '14:00:00'){
      timeSlots[5].push(submission);
    }else if(time < '15:00:00'){
      timeSlots[6].push(submission);
    }else if(time < '16:00:00'){
      timeSlots[7].push(submission);
    }else if(time < '16:30:00'){
      timeSlots[8].push(submission);
    }else{
      timeSlots[9].push(submission);
    }
    submission.creationTime = time;
  })

  timeSlots.forEach((timeSlot, index)=>{
    timeSlot.forEach(sub=>{
      subCountsByCreators.forEach((creator) =>{
        if(sub.first_name === creator[0]){
          creator[index+1]++;
        }
    })
  })
})


useEffect(()=>{
    let columnX = ["x", "< 9", " 9 ", " 10 ", " 11 ", " 12 ", " 13 ", " 14 ", " 15 ", " 16 ", "> 16:30"];
    subCountsByCreators.unshift(columnX);
    //generate the bar chart using billboard.js
    var chart = bb.generate({
      data: {
        // labels: true,
        x: "x",
        columns: subCountsByCreators,
        type: bar(), // for ESM specify as: bar()
        groups: [creators],
      },
      axis: {
        x: {
          type: "category",
   
        },
        y: {
          type: "category",
        },
      },
      tooltip:{
        show: true,
        format: {
          title: ()=>{
            return "Counts"
          },
          value: (value)=>{
            if(value === 0){return}
            return value
          }
        },
      },
      // regions: [
      //   {
      //     axis: "x",
      //     start: 1,
      //     end: 4,
      //     class: "region-1-4"
      //   }
      // ],
      legend:{
        contents: {
          bindto: "#legend",
          template: "<span style='color:#fff;padding:10px;background-color:{=COLOR}'>{=TITLE}</span>"
        },
        padding: 20,   
      },
      options: {
        scales: {
          // ticks: {
          //   stepSize: 1,
          //   precision: 0
          // }
        }
      },
      bindto: "#dataStackNormalized",
    });
    chart.resize({
      // width: 1000,
      // height: 400,
      auto: true,
    });
    console.log(subCountsByCreators)
    console.log(creators)
},[subCountsByCreators]);


  return (
    <div className="App">
        <div id="totalTag">Today's Total: {totalSubCounts}</div>
        <div id='dataStackNormalized'></div>
        <div id="legend"></div>
      {/* <div>
        <Login />
      </div> */}
    </div>
  );
}

export default App;
