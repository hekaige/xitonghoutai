/**引入createStore创建Store */

import { createStore, applyMiddleware } from 'redux'
import reducer from '../reducer';
import { composeWithDevTools } from 'redux-devtools-extension'
export default () => createStore(reducer, composeWithDevTools())