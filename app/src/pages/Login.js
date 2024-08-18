import React, { useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { set_authorized } from "../redux/actions";
import { MDBInput, MDBContainer, MDBBtn } from "mdb-react-ui-kit";
import { useHistory } from "react-router-dom";

const Login = ({ set_authorized }) => {
  const history = useHistory();
  const [working, setWorking] = useState(false);
  const [input, setInput] = useState("");

  const submit = () => {
    if (!input) return alert("Please enter a password");

    setWorking(true);
    axios
      .post(process.env.REACT_APP_SOCKET_SERVER + "login", {
        password: input,
      })
      .then((res) => {
        set_authorized(res.data.logs);
        history.push("/laptops");
      })
      .catch((err) => {
        setWorking(false);
        alert(err);
      });
  };

  return (
    <MDBContainer className="mt-5">
      <MDBInput
        value={input}
        label="Password"
        onChange={(e) => setInput(e.target.value)}
      />
      <MDBBtn className="mt-2" disabled={working} onClick={submit}>
        {working ? "Please Wait..." : "Submit"}
      </MDBBtn>
    </MDBContainer>
  );
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, { set_authorized })(Login);
