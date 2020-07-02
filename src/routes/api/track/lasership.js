import * as api from '../../utils/api.js';
import dotenv from 'dotenv'

dotenv.config();

export function post(req, res) {
	const { trackingNumber } = req.body;
  
  const endpoint = `http://www.lasership.com/track/${trackingNumber}/json`

  api.get(endpoint)
  .then(response => {
    let finalResponse = {
      status: null,
      activity: [],
      deliveredOn: null,
      estimatedDelivery: response.EstimatedDeliveryDate ? fixTime(response.EstimatedDeliveryDate) + "-000000" : null
    }
    if(response.Events && response.Events.length > 0) {
      const activities = response.Events;
      finalResponse.status = activities[0].EventLabel
      if (finalResponse.status == "Delivered") {
        finalResponse.deliveredOn = fixTime(activities[0].DateTime)
      }
      const tempActivity = [];
      console.log(activities[0])
      for (const activity of activities) {
        console.log(fixTime(activity.DateTime))
        tempActivity.push({
          Location: `${activity.City ? activity.City : ""}` + `${activity.State ? ", " + activity.State : ""}` + `${activity.Country ? activity.State ? ", " + activity.Country : activity.Country : ""}`,
          Status: `${activity.EventLabel ? activity.EventLabel : null }`,
          DateTime: fixTime(activity.DateTime)
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
  return rawTime.replaceAll("-", "").replaceAll(":", "").replaceAll("T", "-")
}

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};