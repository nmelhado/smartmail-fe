import {Datastore} from '@google-cloud/datastore';
import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import session from 'express-session'
import sessionFileStore from 'session-file-store'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import isMobile from 'is-mobile'

dotenv.config();

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

if (dev) {
  const FileStore = sessionFileStore(session)
  polka() // You can also use Express
    .use(bodyParser.json())
    .use(session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 3600000
      },
      store: new FileStore({
        path: '.sessions'
      })
    }))
    .use(
      compression({ threshold: 0 }),
      sirv('static', { dev }),
      sapper.middleware({
        session: req => ({
          mobile: isMobile({ua: req.headers['user-agent'], tablet: true}),
          user: req.session && req.session.user,
          addresses: req.session && req.session.addresses,
        })
      })
    )
    .listen(PORT, err => {
      if (err) console.log('error', err);
    });
} else {
  const DatastoreStore = require('@google-cloud/connect-datastore')(session);
  polka() // You can also use Express
    .use(bodyParser.json())
    .use(session({
      secret: 'yoursessionsecretkey',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 3600000
      },
      store: new DatastoreStore({
        kind: 'express-sessions',
     
        // Optional: expire the session after this many milliseconds.
        // note: datastore does not automatically delete all expired sessions
        // you may want to run separate cleanup requests to remove expired sessions
        // 0 means do not expire
        expirationMs: 0,
     
        dataset: new Datastore({
     
          // For convenience, @google-cloud/datastore automatically looks for the
          // GCLOUD_PROJECT environment variable. Or you can explicitly pass in a
          // project ID here:
          projectId: process.env.GCLOUD_PROJECT,
     
          // For convenience, @google-cloud/datastore automatically looks for the
          // GOOGLE_APPLICATION_CREDENTIALS environment variable. Or you can
          // explicitly pass in that path to your key file here:
          keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
        })
      })
    }))
    .use(
      compression({ threshold: 0 }),
      sirv('static', { dev }),
      sapper.middleware({
        session: req => ({
          mobile: isMobile({ua: req.headers['user-agent'], tablet: true}),
          user: req.session && req.session.user,
          addresses: req.session && req.session.addresses,
        })
      })
    )
    .listen(PORT, err => {
      if (err) console.log('error', err);
    });
}