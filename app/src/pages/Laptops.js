import React, { useEffect, useState } from "react";
import {
  MDBListGroup,
  MDBListGroupItem,
  MDBContainer,
  MDBBtn,
} from "mdb-react-ui-kit";
import { connect } from "react-redux";
import { set_logs } from "../redux/actions";
import axios from "axios";
import { prettyPrintJson } from "pretty-print-json";

const Laptops = ({ logs, set_logs }) => {
  useEffect(() => {
    if (!logs?.length) retry();
  }, []);

  const [deviceSelected, setDeviceSelected] = useState(logs[0]?.device);
  const [working, setWorking] = useState(false);

  const retry = () => {
    setWorking(true);
    axios
      .post(process.env.REACT_APP_SOCKET_SERVER + "reload", {
        logs: logs.map((log) => log._id),
      })
      .then((res) => {
        console.log("res", res.data);
        if (!deviceSelected)
          setDeviceSelected(
            res.data.logs.sort(
              (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
            )[0].device
          );
        set_logs(res.data.logs);
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => setWorking(false));
  };

  if (!logs.length)
    return (
      <MDBContainer fluid className="mt-4">
        <h5 className="text-center display-6">No logs found</h5>
        <MDBBtn
          onClick={retry}
          className="mt-4 d-block mx-auto"
          disabled={working}
        >
          {working ? "Fetching Logs" : "Retry"}
        </MDBBtn>
      </MDBContainer>
    );

  const logsToShow = logs
    .filter((log) => log.device === deviceSelected)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <MDBContainer fluid className="mt-4">
      <div className="row">
        <div className="col-3">
          <MDBListGroup>
            {[...new Set(logs.map((log) => log.device))].map((device) => (
              <MDBListGroupItem
                style={{ cursor: "pointer" }}
                onClick={() => setDeviceSelected(device)}
                action
                active={deviceSelected === device}
                key={device}
              >
                {device}
              </MDBListGroupItem>
            ))}
          </MDBListGroup>
        </div>
        {logs.length && (
          <div className="col-9">
            <MDBListGroup>
              {logsToShow.map((log) => (
                <MDBListGroupItem key={log._id}>
                  <div className="d-flex justify-content-between">
                    <h5>{log.timestamp}</h5>
                    <p>{log._id}</p>
                  </div>
                  <h6>Data:</h6>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: prettyPrintJson.toHtml(log.data),
                    }}
                  ></div>
                  <h6>Request headers:</h6>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: prettyPrintJson.toHtml(log.headers),
                    }}
                  ></div>
                </MDBListGroupItem>
              ))}
            </MDBListGroup>
          </div>
        )}
      </div>
    </MDBContainer>
  );
};

const mapStateToProps = (state) => ({
  logs: state.logs,
});

export default connect(mapStateToProps, { set_logs })(Laptops);
