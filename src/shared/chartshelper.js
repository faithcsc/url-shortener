// output format:
//   [
//     {
//        "name":"Page A",
//        "amt":2400
//     },
//     {
//        "name":"Page B",
//        "amt":2210
//     },
//     {
//        "name":"Page C",
//        "amt":2290
//     },
//  ]

// input format:
// [
//     {
//       short: 'U77tji',
//       long: 'ft.com',
//       createdOn: 1624377600,
//       analytics: [
//         {
//           ip: '',
//           datetime: 1624387200,
//         },
//         {
//           ip: '',
//           datetime: 1624396800,
//         },

import moment from 'moment';
import _, { map } from 'underscore';

const convertData = (rawlinkdata, splitBy = 'day') => {
  // splitBy = all, hour
  console.log(`rawlinkdata: ${JSON.stringify(rawlinkdata)}`);
  const converted = rawlinkdata.map((rawlinkdataItem) => {
    const datetimes = rawlinkdataItem.analytics.map((analyticsItem) => analyticsItem.datetime * 1000);
    const datetimesDict = datetimes.map((e) => ({ x: e }));
    // const grouped = _.groupBy(datetimes, (date) => moment(date).startOf('day').format());
    // const groupedCounts = Object.keys(grouped).map((date) => ({ x: moment(date).valueOf(), y: grouped[date].length }));
    // groupedCounts.sort((a, b) => a.x - b.x);
    return datetimesDict;
  });
  console.log(`converted: ${JSON.stringify(converted)}`);
  return converted;
};
export default convertData;
