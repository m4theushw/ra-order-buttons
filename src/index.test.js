import React from 'react';
import {
  renderWithRedux,
  DataProviderContext,
  refreshView,
  showNotification,
} from 'react-admin';
import OrderButtons from './index';
import { fireEvent, cleanup, wait } from '@testing-library/react';

describe('OrderButtons', () => {
  afterEach(cleanup);

  it('should disable buttons when the sort is not the same as the source', () => {
    const { queryByTitle } = renderWithRedux(
      <DataProviderContext.Provider value={{}}>
        <OrderButtons source="order" record={{ order: 1 }} resource="posts" />
      </DataProviderContext.Provider>,
      {
        admin: {
          resources: {
            posts: {
              list: {
                params: {
                  order: 'ASC',
                  sort: 'title',
                },
              },
            },
          },
        },
      }
    );
    expect(queryByTitle('Move up').disabled).toBeTruthy();
    expect(queryByTitle('Move down').disabled).toBeTruthy();
  });

  it('should disable buttons when the order is not ASC', () => {
    const { queryByTitle } = renderWithRedux(
      <DataProviderContext.Provider value={{}}>
        <OrderButtons source="order" record={{ order: 1 }} resource="posts" />
      </DataProviderContext.Provider>,
      {
        admin: {
          resources: {
            posts: {
              list: {
                params: {
                  order: 'DESC',
                  sort: 'order',
                },
              },
            },
          },
        },
      }
    );
    expect(queryByTitle('Move up').disabled).toBeTruthy();
    expect(queryByTitle('Move down').disabled).toBeTruthy();
  });

  it("should disable buttons when the record doesn't have an order value", () => {
    const { queryByTitle } = renderWithRedux(
      <DataProviderContext.Provider value={{}}>
        <OrderButtons source="order" record={{}} resource="posts" />
      </DataProviderContext.Provider>,
      {
        admin: {
          resources: {
            posts: {
              list: {
                params: {
                  order: 'ASC',
                  sort: 'order',
                },
              },
            },
          },
        },
      }
    );
    expect(queryByTitle('Move up').disabled).toBeTruthy();
    expect(queryByTitle('Move down').disabled).toBeTruthy();
  });

  it('should call the Data Provider when the up button is clicked', () => {
    const dataProvider = { move: jest.fn().mockResolvedValue({ data: {} }) };
    const { queryByTitle } = renderWithRedux(
      <DataProviderContext.Provider value={dataProvider}>
        <OrderButtons
          source="order"
          record={{ id: 2, order: 1 }}
          resource="posts"
        />
      </DataProviderContext.Provider>,
      {
        admin: {
          resources: {
            posts: {
              list: {
                params: {
                  filter: { author: 'foobar' },
                  order: 'ASC',
                  sort: 'order',
                },
              },
            },
          },
        },
      }
    );
    fireEvent.click(queryByTitle('Move up'));
    expect(dataProvider.move).toBeCalledWith('posts', {
      id: 2,
      direction: 'up',
      filter: { author: 'foobar' },
    });
  });

  it('should call the Data Provider when the down button is clicked', () => {
    const dataProvider = { move: jest.fn().mockResolvedValue({ data: {} }) };
    const { queryByTitle } = renderWithRedux(
      <DataProviderContext.Provider value={dataProvider}>
        <OrderButtons
          source="order"
          record={{ id: 2, order: 1 }}
          resource="posts"
        />
      </DataProviderContext.Provider>,
      {
        admin: {
          resources: {
            posts: {
              list: {
                params: {
                  filter: { author: 'foobar' },
                  order: 'ASC',
                  sort: 'order',
                },
              },
            },
          },
        },
      }
    );
    fireEvent.click(queryByTitle('Move up'));
    expect(dataProvider.move).toBeCalledWith('posts', {
      id: 2,
      direction: 'up',
      filter: { author: 'foobar' },
    });
  });

  it('should refresh on success', async () => {
    const dataProvider = { move: jest.fn().mockResolvedValue({ data: {} }) };
    const { queryByTitle, dispatch } = renderWithRedux(
      <DataProviderContext.Provider value={dataProvider}>
        <OrderButtons
          source="order"
          record={{ id: 2, order: 1 }}
          resource="posts"
        />
      </DataProviderContext.Provider>,
      {
        admin: {
          resources: {
            posts: {
              list: {
                params: {
                  filter: { author: 'foobar' },
                  order: 'ASC',
                  sort: 'order',
                },
              },
            },
          },
        },
      }
    );
    fireEvent.click(queryByTitle('Move up'));
    await wait();
    expect(dispatch).toHaveBeenCalledWith(refreshView());
  });

  it('should show a notification on fail', async () => {
    const dataProvider = {
      move: jest.fn().mockRejectedValue({ message: 'foobar' }),
    };
    const { queryByTitle, dispatch } = renderWithRedux(
      <DataProviderContext.Provider value={dataProvider}>
        <OrderButtons
          source="order"
          record={{ id: 2, order: 1 }}
          resource="posts"
        />
      </DataProviderContext.Provider>,
      {
        admin: {
          resources: {
            posts: {
              list: {
                params: {
                  filter: { author: 'foobar' },
                  order: 'ASC',
                  sort: 'order',
                },
              },
            },
          },
        },
      }
    );
    fireEvent.click(queryByTitle('Move up'));
    await wait();
    expect(dispatch.mock.calls[5][0]).toEqual(
      showNotification('foobar', 'warning', {
        messageArgs: {},
        undoable: false,
      })
    );
  });
});
