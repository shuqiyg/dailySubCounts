import React, {useState, useEffect} from 'react';
import bb, {area, bar} from "billboard.js";
import axios from 'axios';
import './App.css';



function App() {
  let [dailyCounts, setDailyCounts] = useState([]);

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

  useEffect(()=>{
    axios.get("http://apps6.amfredericks.com/submissionapi/dailyCount")
  .then((response)=>{
    setDailyCounts(response.data);
  })
  },[])

  // console.log('10:00:01' > '10:00:01');

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
    let columnX = ["x", "< 09:00", "09:00-09:59", "10:00-10:59", "11:00-11:59", "12:00-12:59", "13:00-13:59", "14:00-14:59", "15:00-15:59", "16:00-16:30", "> 16:30"];
    subCountsByCreators.unshift(columnX);
    var chart = bb.generate({
      data: {
        x: "x",
        columns: subCountsByCreators,
        type: bar(), // for ESM specify as: bar()
        groups: [creators],
        stack: {
          // normalize: true
        }
      },
      axis: {
        x: {
          type: "category",
   
        },
        y: {
          
        }
      },
      options: {
        scales: {
          ticks: {
            stepSize: 1,
            precision: 0
          }
        }
      },
      bindto: "#dataStackNormalized"
    });
    chart.resize({
      width: 1000,
      height: 300,
    })
    console.log(subCountsByCreators)
    console.log(creators)
},[subCountsByCreators]);


  return (
    <div className="App">
      {timeSlots.map((timeSlot, index)=>(
        <div key={index}>
          <h3>
            {/* {timeSlot.map((submission)=>{
              return <div>{submission.creationTime} {submission.first_name}</div>
            })} */}
          </h3>
          
        </div> 
      ))}
      <div id='dataStackNormalized'></div>
    </div>
  );
}

export default App;
