import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import session from 'express-session'
import sessionFileStore from 'session-file-store'
import bodyParser from 'body-parser'

const FileStore = sessionFileStore(session)

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
	.use(bodyParser.json())
  .use(session({
      secret: 'yoursessionsecretkey',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 10800000
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
        user: req.session && req.session.user,
        addresses: req.session && req.session.addresses,
        token: req.session && req.session.token,
        expires: req.session && req.session.expires
      })
    })
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});