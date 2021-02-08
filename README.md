### react-button-slider

<a href="https://www.npmjs.com/package/@gunawanedy/react-button-slider" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dt/@gunawanedy/react-button-slider" />
</a>

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

const App = () => {
  return (
    <>
      <ReactButtonSlider>
        {/*you can add styling for your button*/}
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

| Name                 | Type     | Default         | Description              |
| -------------------- | -------- | --------------- | ------------------------ |
| Children             | `any`    |                 | any component or element |
| overscrollTransition | `string` | `all 0.2s ease` | css transition property  |
