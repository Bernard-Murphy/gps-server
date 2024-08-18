export const SET_AUTHORIZED = "SET_AUTHORIZED";
export const set_authorized = (logs) => ({
  type: SET_AUTHORIZED,
  data: logs,
});

export const SET_LOGS = "SET_LOGS";
export const set_logs = (logs) => ({
  type: SET_LOGS,
  data: logs,
});
