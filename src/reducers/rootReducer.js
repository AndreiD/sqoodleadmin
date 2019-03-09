const initialState = {
  tokenData: {},
  isFetching: false,
  isError: false
};

const rootReducer = (state = initialState, action) => {
  console.log("action type => ", action.type)
  switch (action.type) {
    case "FETCHED_TOKEN_DATA":
      return Object.assign({}, state, {
        tokenData: action.data,
        isFetching: false,
        isError: false
      });
    default:
      return state;
  }
};


export default rootReducer;
