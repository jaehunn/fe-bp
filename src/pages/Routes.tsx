import { Routes as ReactRouterRoutes, Route, Navigate } from "react-router-dom";

import Home from "./Home.page";
import ReactTableTest from "./ReactTableTest.page";

const Routes = () => {
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/react-table" element={<ReactTableTest />} />

      <Route path="*" element={<Navigate replace to="/" />} />
    </ReactRouterRoutes>
  );
};

export default Routes;
