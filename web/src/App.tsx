import { Routes, Route } from "react-router-dom";
import { Layout } from "./layout";
import { RouteGuard } from "@/components/route-guard";
import { routes } from "./routes";

function App() {
  return (
    <Layout>
      <Routes>
        {routes.public.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<RouteGuard>{element}</RouteGuard>}
          />
        ))}

        {routes.private.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<RouteGuard isPrivate>{element}</RouteGuard>}
          />
        ))}
      </Routes>
    </Layout>
  );
}

export default App;
