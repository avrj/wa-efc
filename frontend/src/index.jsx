import React from 'react';
import ReactDOM from 'react-dom';
import { format, parse, addHours } from 'date-fns';
import { generate } from 'shortid';
import { number } from 'prop-types';

const baseURL = process.env.ENDPOINT;

const getPositionAsPromise = () => new Promise((res, rej) => {
  global.navigator.geolocation.getCurrentPosition(res, rej);
});


const getPosition = async () => {
  try {
    const response = await getPositionAsPromise();
    return response.coords;
  } catch (error) {
    console.error(error);
  }

  return { };
};

const getWeatherFromApi = async (lat, lon) => {
  try {
    const response = await fetch(`${baseURL}/weather?lat=${lat}&lon=${lon}`);
    return response.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

const utcOffset = 2;

const utcStrToReadable = utcStr => format(addHours(parse(utcStr), utcOffset), 'DD.MM HH:mm');

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: null,
    };
  }

  async componentWillMount() {
    const { latitude, longitude } = await getPosition();

    const weather = await getWeatherFromApi(latitude, longitude);

    this.setState({ weather });
  }

  render() {
    const { weather } = this.state;
    const { forecastCount } = this.props;

    const renderImage = (dateText, { icon, description }) => icon && (<div key={generate()} className="icon">
      {utcStrToReadable(dateText)} <img src={`/img/${icon.slice(0, -1)}.svg`} alt={description} />
    </div>);

    const renderWeatherBlock = ({ dt_txt, weather }) => renderImage(dt_txt, weather[0]);

    return (
weather ? <div>
  { weather.city.name }
  { weather.list.slice(0, forecastCount).map(weatherData => renderWeatherBlock(weatherData)) }
</div> : <div>Loading weather data...</div>
    );
  }
}

Weather.propTypes = {
  forecastCount: number,
};

Weather.defaultProps = {
  forecastCount: 2,
};

ReactDOM.render(
  <Weather forecastCount={2} />,
document.getElementById('app')
);
