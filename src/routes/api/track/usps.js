import * as api from '../../utils/api.js';
import dotenv from 'dotenv'

dotenv.config();

export function post(req, res) {
	const { trackingNumber } = req.body;
  
  const endpoint = `https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=<?xml version="1.0" encoding="UTF-8" ?><TrackFieldRequest USERID="${process.env.USPS_ID}"><TrackID ID="${trackingNumber}"/></TrackFieldRequest>`

  api.xmlGet(endpoint)
  .then(response => {
    let finalResponse = {
      status: null,
      activity: [],
      deliveredOn: null
    }
    if(response.TrackResponse) {
      const summary = response.TrackResponse.TrackInfo[0].TrackSummary[0];
      const status = summary.Event[0]
      finalResponse.status = status.includes("Delivered") ? "Delivered" : status;

      const dateTime = fixTime(summary.EventDate[0] + " " + summary.EventTime[0])
      if (finalResponse.status == "Delivered") {
        finalResponse.deliveredOn = dateTime;
      }
      const tempActivity = [];
      tempActivity.push({
        Location: `${summary.EventCity[0]}, ${summary.EventState[0]}`,
        Status: status,
        DateTime: dateTime
      });

      for (const activity of response.TrackResponse.TrackInfo[0].TrackDetail) {
        const dateTime = fixTime(activity.EventDate[0] + " " + activity.EventTime[0])
        tempActivity.push({
          Location: `${activity.EventCity[0]}, ${activity.EventState[0]}`,
          Status: activity.Event[0],
          DateTime: dateTime
        });
      }
      finalResponse.activity = tempActivity;
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(finalResponse));
  })
  .catch(err => {
    console.error(err);
  });
}

function fixTime(rawTime) {
  const digest = new Date(rawTime);
  // const digest = Date.parse(rawTime);
  return digest.getUTCFullYear() + ("0" + (digest.getUTCMonth()+1)).slice(-2) +
  ("0" + digest.getUTCDate()).slice(-2) + "-" + ("0" + digest.getUTCHours()).slice(-2) +
  ("0" + digest.getUTCMinutes()).slice(-2) + ("0" + digest.getUTCSeconds()).slice(-2)
}