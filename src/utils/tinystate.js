import React, { memo, useEffect, useState } from 'react';

export default function State(initialState, setterHandler = value => value) {
  const subscriptions = [];
  let shouldUpdate = true;
  let state = initialState;

  function subscribe(fn) {
    subscriptions.push(fn);
    return function() {
      subscriptions.splice(subscriptions.indexOf(fn), 1);
    };
  }

  const wrapped = () => WrappedComponent => {
    return memo(
      function TinyStateComponent(props) {
        const [, setState] = useState();
        useEffect(() => {
          return subscribe(() => setState({}));
        }, []);
        return React.createElement(WrappedComponent, props);
      },
      function shouldComponentUpdate(props, nextProps) {
        return nextProps !== props || shouldUpdate;
      },
    );
  };

  function get() {
    return state;
  }

  function set(setValue, cb) {
    const newValue =
      typeof setValue === 'function' ? setValue(state) : setValue;

    if (newValue !== state) {
      state = setterHandler(newValue);
      shouldUpdate = true;
      subscriptions.forEach(fn => fn(cb));
    } else {
      shouldUpdate = false;
    }
  }

  wrapped.get = get;
  wrapped.set = set;
  wrapped.subscribe = subscribe;

  return wrapped;
}
