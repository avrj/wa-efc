import React from 'react';
import ReactDOM from 'react-dom';
import { format, parse, addHours } from 'date-fns';
import { generate } from 'shortid';

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

    const utcStrToReadable = utcStr => format(addHours(parse(utcStr), 2), 'DD.MM HH:mm');

    const renderImage = (dateText, { icon, description }) => icon && (<div key={generate()} className="icon">
      {utcStrToReadable(dateText)} <img src={`/img/${icon.slice(0, -1)}.svg`} alt={description} />
    </div>);

    const renderWeatherBlock = ({ dt_txt, weather }) => renderImage(dt_txt, weather[0]);

    return (
      <div>
        { weather && weather.city.name }
        { weather && weather.list.slice(0, 2).map(weatherData => renderWeatherBlock(weatherData)) }
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
