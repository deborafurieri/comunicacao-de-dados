import React from "react";
import RTChart from 'react-rt-chart';

const Chart = (props) => {
  let data = {
    date: new Date(),
    FirstSlave: props.valueFirstSlave,
    SecondSlave: props.valueSecondSlave,
  };
  return (
    <RTChart
      style={
        {
          width: '50%',
          marginTop: '50px',
          marginLeft: "10px",
        }
      }
      fields={['FirstSlave','SecondSlave']}
      data={data} />
  )
}

export default Chart;
