import React from 'react';
import {
  VictoryChart, VictoryHistogram, VictoryAxis, VictoryLabel,
} from 'victory';
import moment from 'moment';

const sharedAxisStyles = {
  tickLabels: {
    fontSize: 13,
  },
  axisLabel: {
    padding: 39,
    fontSize: 13,
    fontStyle: 'italic',
  },
};

const addDays = (epochTime, numDays) => {
  const date = new Date(epochTime);
  date.setDate(date.getDate() + numDays);
  return date;
};

function getDates(startDate, stopDate) {
  startDate.setHours(0, 0, 0);
  stopDate.setHours(0, 0, 0);
  const dateArray = [];
  let currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = addDays(currentDate.valueOf(), 1);
    // currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

function Linechart(props) {
  let { data } = props;
  if (data === undefined) {
    return <div><h2>Loading...</h2></div>;
  }

  data = data[0];

  data.sort((a, b) => a.x - b.x);
  console.log(`Linechart data: ${JSON.stringify(data)}`);
  const earliestDate = new Date(data[0].x);
  const latestDate = new Date(data[data.length - 1].x);
  const daterange = getDates(earliestDate, latestDate);
  daterange.forEach((e) => console.log(e));

  return (
    <VictoryChart scale={{ x: 'time' }} style={{ parent: { padding: 36 } }}>
      <VictoryHistogram
        style={{
          data: {
            strokeWidth: 1,
            fill: '#ffa600',
            stroke: '#000000',
          },
        }}
        data={data}
        daterange={daterange}
      />

      <VictoryAxis
        tickCount={daterange.length}
        tickFormat={(t) => moment(t).format('MMM Do')}
        tickLabelComponent={<VictoryLabel angle={-30} />}
        style={sharedAxisStyles}
      />
      <VictoryAxis
        dependentAxis
        label="Total clicks"
        style={sharedAxisStyles}
      />
    </VictoryChart>
  );
}

export default Linechart;
