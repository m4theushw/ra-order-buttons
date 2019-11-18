# ra-order-buttons

This addon provides you with a component which renders up and down buttons to reorder records in [react-admin](https://github.com/marmelab/react-admin). It connects with your Data Provider by dispatching a `move` action. All the magic is done in the backend so a custom logic is needed to make it work correctly. Check the implementation example below to learn how to adapt your API.

## Instalation

```
npm install --save ra-order-buttons
# or
yarn add ra-order-buttons
```

## Usage

You should pass as source to `<OrderButtons />` the attribute you are using to order the records.

```jsx
import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';
import OrderButtons from 'ra-order-buttons';

export const ProductList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <OrderButtons source="ordering" />
    </Datagrid>
  </List>
);
```

In your Data Provider you sould handle the new request type `move` and map it to the appropriate API call. The Data Provider is called as follow:

```js
dataProvider.move('products', {
  id: 123, // the record id
  direction: 'up', // which button was clicked
  filter: { name: 'Hello World' }, // the filters set for the listing
});
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
