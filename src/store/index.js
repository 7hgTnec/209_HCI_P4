// initialize a default redux store
// This is a global store, it contains all state value of whole website

import {createStore} from 'redux'
import reducer from './reducer';

const store = createStore(reducer);

export default store