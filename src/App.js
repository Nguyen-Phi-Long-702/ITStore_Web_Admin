import { jsx as _jsx } from "react/jsx-runtime";
import { RouterProvider } from "react-router";
import { router } from "./routes";
export default function App() {
    return _jsx(RouterProvider, { router: router });
}
