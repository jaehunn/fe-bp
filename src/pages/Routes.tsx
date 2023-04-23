import { Routes as ReactRouterRoutes, Route, Navigate } from "react-router-dom";

import Home from "./Home.page";
import SelectTest from "./SelecTest.page";

const Routes = () => {
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/compound-select" element={<SelectTest />} />

      <Route path="*" element={<Navigate replace to="/" />} />
    </ReactRouterRoutes>
  );
};

export default Routes;
