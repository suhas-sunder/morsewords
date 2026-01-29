import * as React from "react";

export default function LogoBars() {
  return (
    <>
      <span
        style={{
          position: "absolute",
          left: 8,
          right: 8,
          top: 12,
          height: 3,
          background: "#0b2447",
          borderRadius: 2,
        }}
      />
      <span
        style={{
          position: "absolute",
          left: 8,
          width: "50%",
          bottom: 12,
          height: 3,
          background: "#0b2447",
          borderRadius: 2,
        }}
      />
    </>
  );
}
