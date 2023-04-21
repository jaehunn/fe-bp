import { Routes as ReactRouterRoutes, Route, Navigate } from "react-router-dom";

import Home from "./Home.page";
import OverlayTest from "./OverlayTest.page";

import { OverlayProvider } from "../components/Overlay";

const Routes = () => {
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<Home />} />
      <Route
        path="/overlay"
        element={
          <OverlayProvider>
            <OverlayTest />
          </OverlayProvider>
        }
      />

      <Route path="*" element={<Navigate replace to="/" />} />
    </ReactRouterRoutes>
  );
};

export default Routes;
