import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useDataProvider, useNotify, useRefresh } from 'react-admin';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const OrderButtons = ({ record, resource, source }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const { order, sort, filter } = useSelector(
    state => state.admin.resources[resource].list.params
  );

  const move = direction => {
    dataProvider
      .move(resource, { id: record.id, direction, filter })
      .then(() => refresh())
      .catch(error => notify(error.message, 'warning'));
  };

  const handleUp = e => {
    e.stopPropagation();
    move('up');
  };

  const handleDown = e => {
    e.stopPropagation();
    move('down');
  };

  return (
    <ButtonGroup
      size="small"
      disabled={sort !== source || order !== 'ASC' || !record[source]}
    >
      <Button onClick={handleUp} title="Move up">
        <KeyboardArrowUpIcon />
      </Button>
      <Button onClick={handleDown} title="Move down">
        <KeyboardArrowDownIcon />
      </Button>
    </ButtonGroup>
  );
};

OrderButtons.propTypes = {
  record: PropTypes.object,
  resource: PropTypes.string,
  source: PropTypes.string,
};

export default OrderButtons;
