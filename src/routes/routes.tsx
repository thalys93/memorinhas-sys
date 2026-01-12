import { Route, Routes } from "react-router-dom";
import { AllRoutes } from "./map";
import { JSX } from "react";
// import NotFoundPage from "@/subdomains/public/pages/NotFound/NotFound";

const renderAllRoutes = () => {
    const elements: JSX.Element[] = []
    const applyPrefix = (prefix: string | undefined, path: string) =>
        `${prefix ? `/${prefix}` : ""}/${path}`.replace(/\/+$/, "");

    for (const group of AllRoutes as any) {
        const { public: pub = [], private: priv = [], prefix } = group;

        for (const route of pub) {
            const fullPath = applyPrefix(prefix, route.path);
            const Element = route.element;
            elements.push(<Route key={fullPath} path={fullPath} element={<Element />} />);
        }

        for (const route of priv) {
            const fullPath = applyPrefix(prefix, route.path);
            const Element = route.element;
            const Wrapper = group.privateMiddleware;
            const WrappedElement = Wrapper ? <Wrapper><Element /></Wrapper> : <Element />;

            elements.push(
                <Route
                    key={fullPath}
                    path={fullPath}
                    element={WrappedElement}
                />
            );
        }
    }

    return elements;
}

export default function AppRoutes() {
    return (
        <Routes>
            {renderAllRoutes()}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
    );
}