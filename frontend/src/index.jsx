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
      icon: '',
    };
  }

  async componentWillMount() {
    const { latitude, longitude } = await getPosition();

    const weather = await getWeatherFromApi(latitude, longitude);
    this.setState({ weather });
  }

  render() {
    const { icon } = this.state;

    return (
      <div className="icon">
        { icon && <img src={`/img/${icon}.svg`} alt="Current weather" /> }
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
