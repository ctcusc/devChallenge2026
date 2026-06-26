// Load environment variables from .env FIRST, as a side effect, before the
// import below pulls in the app/route/db modules - they read process.env at
// import time, so the .env values have to be in place by then.
import 'dotenv/config';

import { createApp } from './app';

const app = createApp();
const port = Number(process.env.PORT) || 3001;

app.listen(port, () => {
  console.log(`Feeding Brennen API listening on http://localhost:${port}`);
});
