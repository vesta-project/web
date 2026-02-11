import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { MetaProvider, Link } from "@solidjs/meta";
import { inject as injectAnalytics } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import "./styles/tokens.css";
import "./app.css";

export default function App() {
	injectAnalytics();
	injectSpeedInsights();

	return (
		<MetaProvider>
            <Link rel="icon" type="image/png" href="/favicon.png" />
			<Router
				root={(props) => (
					<div id="vesta-web-root">
						<Suspense>{props.children}</Suspense>
					</div>
				)}
			>
				<FileRoutes />
			</Router>
		</MetaProvider>
	);
}
