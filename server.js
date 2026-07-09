// Production startup file for Hostinger's Node.js (Passenger) runtime.
// Point the hPanel "Application startup file" at this file. It boots Next.js in
// production mode using the build output in .next (run `npm run build` first).
const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`MediKue+ ready on port ${port}`);
  });
});
