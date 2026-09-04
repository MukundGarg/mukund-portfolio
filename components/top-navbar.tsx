import React from "react";

export function TopNavbar() {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="dot"></span> LATENT://PASSAGE
      </div>
      <div className="readout">
        <div className="seg">
          <span>PHASE</span>
          <span className="val mono" id="stepReadout">
            00 / 05
          </span>
        </div>
        <div className="seg accent">
          <span>SCROLL</span>
          <span className="val mono" id="scrollReadout">
            0%
          </span>
        </div>
        <div className="seg">
          <span>ACTIVE NODES</span>
          <span className="val mono" id="nodeReadout">
            0
          </span>
        </div>
      </div>
      <div className="progress-rail">
        <div className="progress-fill" id="progressFill"></div>
      </div>
    </header>
  );
}
