const Koa = require('koa');
const KoaRouter = require('koa-router');

const app = new Koa();
const router = new KoaRouter();
const serverPort = 2332;

app.use((ctx, next) => {
  console.log(ctx.request.body);
  return next();
});

router.get( '/callback', async (ctx) => {
  try {
    ctx.status = 200;
  }
  catch (error) {
    ctx.error = 500
    console.error(error);
  }
})

app.use(router.routes());
app.listen(serverPort, () => {
  console.log('Running on port:', serverPort);
});

