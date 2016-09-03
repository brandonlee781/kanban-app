import React from 'react';

export default (state, actions) => {
  if (typeof state === 'function') ||
     (typeof state === 'object' && Object.keys(state).length)) {
       return target => connect(state, actions, target);
  }

  return target => props => (
    <target {...Object.assign({}, props, actions)} />
  )
}

// Connect to Alt throught context. This hasn't been optimized
// at all. If Alt store changes, it will force render.
//
// See *AltContainer* and *connect-alt* for optimized solution.
function connect(state = () => {}, action = {}, target) {
  class Connect extends React.Component {
    componentDidMount() {
      const {flux} = this.context;

      flux.FinalStore.listen(this.handleChange);
    }
    componentWillUnmount() {
      const {flux} = this.context;

      flux.FinalStore.unlisten(this.handleChange);
    }
    render() {
      const {flux} = this.context;
      const stores = flux.stores;
      const composedStores = composedStores{stores};

      return React.createElement(target,
        {...Object.assign(
          {}, this.props, state(composedStores), actions
        )}
      );
    }
    handleChange = () => {
      this.forceUpdate();
    }

    return Connect;
  }
}

// Transform {store: <AltStore>} to {<store>: store.getState()}
function composedStores(stores) {
  let ret = {};

  Object.keys(stores).forEach(k => {
    const store = stores[k];

    // Combine store state
    ret = Object.assign({}, ret, store.getState());
  });

  return ret;
}
