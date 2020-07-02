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
      deliveredOn: null,
      estimatedDelivery: null
    }
    if(response.TrackResponse) {
      const summary = response.TrackResponse.TrackInfo.TrackSummary;
      const status = summary.Event
      finalResponse.status = status.includes("Delivered") ? "Delivered" : status;

      const dateTime = fixTime(summary.EventDate + " " + summary.EventTime)
      if (finalResponse.status == "Delivered") {
        finalResponse.deliveredOn = dateTime;
      }
      const tempActivity = [];
      tempActivity.push({
        Location: `${summary.EventCity}, ${summary.EventState}`,
        Status: status,
        DateTime: dateTime
      });

      if(response.TrackResponse.TrackInfo.TrackDetail) {
        for (const activity of response.TrackResponse.TrackInfo.TrackDetail) {
          const dateTime = fixTime(activity.EventDate + " " + activity.EventTime)
          tempActivity.push({
            Location: `${activity.EventCity}, ${activity.EventState}`,
            Status: activity.Event,
            DateTime: dateTime
          });
        }
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
  return digest.getUTCFullYear() + ("0" + (digest.getUTCMonth()+1)).slice(-2) +
  ("0" + digest.getUTCDate()).slice(-2) + "-" + ("0" + digest.getUTCHours()).slice(-2) +
  ("0" + digest.getUTCMinutes()).slice(-2) + ("0" + digest.getUTCSeconds()).slice(-2)
}