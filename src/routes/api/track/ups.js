import * as api from '../../utils/api.js';
import dotenv from 'dotenv'

dotenv.config();

const endpoint = 'https://onlinetools.ups.com/json/Track'; // production

export function post(req, res) {
	const { trackingNumber } = req.body;
  const body = {
    Security: {
      UsernameToken: {
        Username: process.env.UPS_USERNAME,
        Password: process.env.UPS_PASSWORD
      },
      UPSServiceAccessToken: {
        AccessLicenseNumber: process.env.UPS_ACCESS_TOKEN
      }
    },
    TrackRequest: {
      Request: {
        RequestAction: "Track",
        RequestOption: "activity"
      },
      InquiryNumber: trackingNumber
    }
  };

  api.post(endpoint, body, false, true)
  .then(response => {
    let finalResponse = {
      status: null,
      activity: [],
      deliveredOn: null
    }
    if(response.TrackResponse.Response.ResponseStatus.Code == 1) {
      const activities = response.TrackResponse.Shipment.Package.Activity;
      finalResponse.status = activities[0].Status.Description
      if (finalResponse.status == "Delivered") {
        finalResponse.deliveredOn = activities[0].Date + "-" + activities[0].Time;
      }
      const tempActivity = [];
      for (const activity of activities) {
        tempActivity.push({
          Location: `${activity.ActivityLocation.Address.City ? activity.ActivityLocation.Address.City : ""}` + `${activity.ActivityLocation.Address.StateProvinceCode ? ", " + activity.ActivityLocation.Address.StateProvinceCode : ""}` + `${activity.ActivityLocation.Address.CountryCode ? activity.ActivityLocation.Address.StateProvinceCode ? ", " + activity.ActivityLocation.Address.CountryCode : activity.ActivityLocation.Address.CountryCode : ""}`,
          Status: `${activity.Status.Description ? activity.Status.Description : null }`,
          DateTime: activity.Date + "-" + activity.Time
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