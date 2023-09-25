import axiosRetry from 'axios-retry';
import axios from 'axios';
 
axiosRetry(axios, { 
   retries: 3,
   retryDelay: (...arg) => axiosRetry.exponentialDelay(...arg, 1000),
   retryCondition(error) {
    switch (error.response.status) {
      //retry only if status is 500 or 501
      case 500:
      case 501:
        return true;
      default:
        return false;
      }
    },
    onRetry: (retryCount, error, requestConfig) => {
      console.log(`retry count: `, retryCount);
      if(retryCount == 2) {
        requestConfig.url = 'https://postman-echo.com/status/200';
      }
    },
});
 
(async () => {
  try {
    const res = await axios.get('https://postman-echo.com/status/500');
    console.log(`inside async:`, res.status);
  } catch(err) {
    console.error(`Error occured: `, err.message);
  }  
})();

//top level await is possible as this is a module and running with Node 18+
//const res2 = await axios.get('https://postman-echo.com/status/500');
//console.log(`top level await:`, res2.status);
