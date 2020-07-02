import * as api from '../../utils/api.js';
import dotenv from 'dotenv'

dotenv.config();

export function post(req, res) {
	const { trackingNumber } = req.body;
  
  const endpoint = 'https://ws.fedex.com:443/web-services';

  const body = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://fedex.com/ws/track/v18">
  <SOAP-ENV:Body>
     <TrackRequest>
        <WebAuthenticationDetail>
           <UserCredential>
              <Key>${process.env.FEDEX_KEY}</Key>
              <Password>${process.env.FEDEX_PASSWORD}</Password>
           </UserCredential>
        </WebAuthenticationDetail>
        <ClientDetail>
           <AccountNumber>${process.env.FEDEX_ACCOUNT_NUMBER}</AccountNumber>
           <MeterNumber>${process.env.FEDEX_METER_NUMBER}</MeterNumber>
        </ClientDetail>
        <TransactionDetail>
           <CustomerTransactionId>Track By Number_v18</CustomerTransactionId>
           <Localization>
              <LanguageCode>EN</LanguageCode>
           </Localization>
        </TransactionDetail>
        <Version>
           <ServiceId>trck</ServiceId>
           <Major>18</Major>
           <Intermediate>0</Intermediate>
           <Minor>0</Minor>
        </Version>
        <SelectionDetails>
           <PackageIdentifier>
              <Type>TRACKING_NUMBER_OR_DOORTAG</Type>
              <Value>${trackingNumber}</Value>
           </PackageIdentifier>
        </SelectionDetails>
        <ProcessingOptions>INCLUDE_DETAILED_SCANS</ProcessingOptions>
     </TrackRequest>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`

  api.xmlPost(endpoint, body)
  .then(response => {
    let finalResponse = {
      status: null,
      activity: [],
      deliveredOn: null,
      estimatedDelivery: null
    }
    const activities = response["SOAP-ENV:Envelope"]["SOAP-ENV:Body"].TrackReply.CompletedTrackDetails.TrackDetails.Events;
    if(activities && activities.length > 0) {
      finalResponse.status = activities[0].EventDescription
      if (finalResponse.status == "Delivered") {
        finalResponse.deliveredOn = fixTime(activities[0].Timestamp);
      }
      const tempActivity = [];
      for (const activity of activities) {
        tempActivity.push({
          Location: `${activity.Address.City ? activity.Address.City : ""}` + `${activity.Address.StateOrProvinceCode ? ", " + activity.Address.StateOrProvinceCode : ""}` + `${activity.Address.CountryCode ? activity.Address.StateOrProvinceCode ? ", " + activity.Address.CountryCode : activity.Address.CountryCode : ""}`,
          Status: `${activity.EventDescription ? activity.EventDescription : null }`,
          DateTime: fixTime(activity.Timestamp)
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