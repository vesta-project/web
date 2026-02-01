import { Navigate, useLocation } from "@solidjs/router";

export default function Join() {
    const location = useLocation();
    return <Navigate href={`/${location.search}`} />;
}
