import axios from 'axios';
import { formatPostData } from './redux_functions';

export default axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformRequest(data) {
    return formatPostData(data);
  }
});
