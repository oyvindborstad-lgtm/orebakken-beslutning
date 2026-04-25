import { Route, Switch } from "wouter";
import Layout from "./components/Layout";
import Welcome from "./pages/Welcome";
import FindAndel from "./pages/FindAndel";
import Result from "./pages/Result";
import Bakgrunn from "./pages/Bakgrunn";
import Grunnlag from "./pages/Grunnlag";

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Welcome} />
        <Route path="/bakgrunn" component={Bakgrunn} />
        <Route path="/grunnlag" component={Grunnlag} />
        <Route path="/finn" component={FindAndel} />
        <Route path="/leilighet/:nr" component={Result} />
        <Route>
          <div className="mx-auto max-w-xl">
            <div className="card">
              <h1 className="display text-xl font-semibold">Siden finnes ikke</h1>
              <p className="mt-2 text-sm text-muted">
                Gå til forsiden og prøv på nytt.
              </p>
            </div>
          </div>
        </Route>
      </Switch>
    </Layout>
  );
}
