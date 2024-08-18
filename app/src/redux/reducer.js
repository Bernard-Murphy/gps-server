import { io } from "socket.io-client";
import { SET_AUTHORIZED, SET_LOGS } from "./actions";

const initialState = {
  socket: false,
  logs: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTHORIZED:
      return {
        ...state,
        logs: action.data,
        socket: io(process.env.REACT_APP_SOCKET_SERVER),
      };
    case SET_LOGS:
      return {
        ...state,
        logs: [
          ...state.logs.filter(
            (log) => !action.data.find((d) => d._id === log._id)
          ),
          ...action.data,
        ],
      };
    default:
      return {
        ...state,
      };
  }
};

export default reducer;
