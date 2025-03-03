import React from 'react';
import Counter from '@/components/counter/Counter';
import User from '@/components/user/User';

const App: React.FC = () => (
  <div className='app'>
    <Counter />
    <User />
  </div>
);

export default App;
