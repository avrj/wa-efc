const Koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const cors = require('kcors');

const appId = process.env.APPID || '';
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const fallbackCity = process.env.TARGET_CITY || 'Helsinki,fi';

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors());

const getCoordsParams = (lat, lon) => `lat=${lat}&lon=${lon}`;

const getFallbackParams = (city) => `q=${city}`;

const isValidCoords = (lat, lon) => !isNaN(lat) && !isNaN(lon);

const coordsOrFallbackParams = (lat, lon) => isValidCoords(lat, lon) ? getCoordsParams(lat, lon) : getFallbackParams(fallbackCity);

const fetchWeather = async (lat, lon) => {
  const queryParams = coordsOrFallbackParams(lat, lon);

  const endpoint = `${mapURI}/weather?${queryParams}&appid=${appId}`;

  const response = await fetch(endpoint);

  return response ? response.json() : {};
};

router.get('/api/weather', async ctx => {
  const { lat, lon, } = ctx.query;

  const weatherData = await fetchWeather(lat, lon);

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.weather ? weatherData.weather[0] : {};
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);

console.log(`App listening on port ${port}`);