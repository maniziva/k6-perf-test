// import necessary modules
import { check } from 'k6';
import http from 'k6/http';

// define configuration
export const options = {
    // define thresholds
    thresholds: {
      http_req_failed: ['rate<0.01'], // http errors should be less than 1%
      http_req_duration: ['p(99)<1000'], // 99% of requests should be below 1s
    },
    // define scenarios
    scenarios: {
      // arbitrary name of scenario
      average_load: {
        executor: 'ramping-vus',
        stages: [
          // ramp up to average load of 20 virtual users
          { duration: '10s', target: 20 },
          // maintain load
          { duration: '50s', target: 20 },
          // ramp down to zero
          { duration: '5s', target: 0 },
        ],
      },
    },
  };

export default function () {
  // define URL and request body
  const url = 'https://quickpizza.grafana.com/api/users/token/login';
  const payload = JSON.stringify({
    username: 'default',
    password: '1234',
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // send a post request and save response as a variable
  const res = http.post(url, payload, params);

  // check that response is 200
  check(res, {
    'response code was 200': (res) => res.status == 200,
  });
}