import { render, screen } from '@testing-library/react';
import App from './App';
import {Provider} from 'react-redux';
import reducer from './Reducers/reducer'
import {createStore} from 'redux';
import {loadState, saveState} from './localStorage'

const persistedState=loadState()
const store=createStore(reducer,persistedState)

store.subscribe(()=>{
    saveState(store.getState())
})

test('renders learn react link', () => {
  render(<Provider store={store}><App /></Provider>);
  const linkElement = screen.getByText(/scrum/i);
  expect(linkElement).toBeInTheDocument();
});
