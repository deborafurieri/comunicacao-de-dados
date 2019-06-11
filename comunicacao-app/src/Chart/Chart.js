import React from "react";
import RTChart from 'react-rt-chart';

const Chart = (props) => {
  let data = {
    date: new Date(),
    slave: props.valueSlave,
  };
  return (
    <RTChart
      style={
        {
          marginTop: '20px',
          marginRight: '50px',
        }
      }
      fields={['slave']}
      data={data} />
  )
}

export default Chart;
