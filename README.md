# ra-order-buttons

This addon provides a component which renders up and down buttons to reorder records in [react-admin](https://github.com/marmelab/react-admin). It connects with your Data Provider by dispatching a `move` action. All the magic is done in the backend so a custom logic is needed to make it work correctly. Check the backend section below to learn how to adapt your API.

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

## Implementing the backend

When user clicks in one of the two buttons we have to switch the order value between the clicked record and the immediately above (move up) or below record (move down). The example below was based on the logic behind Joomla's Administration page which has the same functionality. You can check the original code [here](https://github.com/joomla/joomla-cms/blob/staging/libraries/src/Table/Table.php#L1423).

```php
<?php

$dsn = 'mysql:host=127.0.0.1;dbname=mydb';
$pdo = new PDO($dsn, 'root', 'secret');

$id = intval($_GET['id']);
$direction = $_GET['direction'];
$filter = json_decode($_GET['filter']);

$record = $pdo->query('SELECT ordering FROM products WHERE id = ' . $id);
$ordering = $record->fetchColumn();

$conditions = [];
if ($filter->q) {
    $conditions[] = 'name LIKE :search';
}
if ($direction === 'up') {
    $conditions[] = 'ordering < :ordering';
} else {
    $conditions[] = 'ordering > :ordering';
}

$sql = 'SELECT * FROM products';
$sql .= ' WHERE ' . implode(' AND ', $conditions);
$sql .= ' ORDER BY ordering ' . ($direction === 'up' ? 'DESC' : 'ASC');
$sql .= ' LIMIT 1';

$stmt = $pdo->prepare($sql);
$stmt->bindValue(':ordering', $ordering);
if ($filter->q) {
    $stmt->bindValue(':search', "%{$filter->q}%");
}

$stmt->execute();
$result = $stmt->fetchObject();

if ($result) {
    $pdo->exec('UPDATE products
        SET ordering = ' . $ordering . '
        WHERE id = ' . $result->id);

    $pdo->exec('UPDATE products
        SET ordering = ' . $result->ordering . '
        WHERE id = ' . $id);
}

header('Content-Type: application/json');
echo json_encode(['data' => null]);
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
