// this used to set all states' default value
import * as actions from './constants'

const initialState = {}

export default (state = initialState, { type, payload }) => {
  switch (type) {

  case actions.CONST_VAL:
    return { ...state, ...payload }

  default:
    return state
  }
}
