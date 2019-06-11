import React from "react";
import RTChart from 'react-rt-chart';

const Chart = (props) => {
  let data = {
    date: new Date(),
    slave: props.valueSlave,
    setPoint: props.setPoint,
  };
  return (
    <RTChart
      style={
        {
          marginTop: '20px',
          marginRight: '50px',
        }
      }
      maxValues={10}
      fields={['setPoint', 'slave']}
      data={data} />
  )
}

export default Chart;
