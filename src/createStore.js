import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';

const onError = __DEV__
	? (error, { sagaStack }) => console.warn(error, sagaStack)
	: undefined;

export default function CreateStore(reducers, sagas) {

	const sagaMiddleware = createSagaMiddleware({ onError });

	const store = createStore(
		reducers,
		composeWithDevTools(applyMiddleware(sagaMiddleware))
	);

	// kick off root saga
	let sagasManager = sagaMiddleware.run(sagas);

	// Hot Module
	if (module.hot) {
		module.hot.accept(() => {
			store.replaceReducer(reducers);

			sagasManager.cancel();
			sagasManager.done.then(
				() => (sagasManager = sagaMiddleware.run(sagas))
			);
		});
	}

	return store;
};
