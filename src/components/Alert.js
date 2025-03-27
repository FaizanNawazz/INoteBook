import React from "react";

const Alert = (props) => {
  const alertType =
    props.alert?.type === "danger" ? "error" : props.alert?.type;
  return (
    <div style={{ height: "50px", paddingTop: "56px" }}>
      {props.alert && (
        <div
          className={`alert alert-${props.alert.type} alert-dismissible fade show `}
          role="alert"
        >
          <strong>{alertType}</strong>: {props.alert.message}
        </div>
      )}
    </div>
  );
};

export default Alert;
