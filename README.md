### react-button-slider

Wrap all your buttons or any component in react-button-slider and it will be horizontally scrollable without any scrollbar

![Example](https://drive.google.com/uc?export=view&id=1CK85t9jzbater42QeO70LAGVhpZrUYa1)
![Example](https://drive.google.com/uc?export=view&id=16xkDfdRIc6Xrv2KYmXFsFc-AY15TrGnL)

### Installation

**npm**

```bash
npm i @gunawanedy/react-button-slider
```

**yarn**

```bash
yarn add @gunawanedy/react-button-slider
```

### Example

```js
import React from 'react';

import ReactButtonSlider from '@gunawanedy/react-button-slider';

// only for styling the button and content
import './scss/test.scss';

const App = () => {
  return (
    <>
      <ReactButtonSlider>
        <button>Category 1</button>
        <button>Category 2</button>
        <button>Category 3</button>
        <button>Category 4</button>
      </ReactButtonSlider>
      <main className="content">
        <h1>Your Contents</h1>
      </main>
    </>
  );
};

export default App;
```

### Props

Children: any
