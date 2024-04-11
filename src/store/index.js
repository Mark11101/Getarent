import createStore from '../createStore'
import reducers from '../actions/reducers'
import sagas from '../sagas'

const store = createStore(reducers, sagas)

export default store
