import React from 'react';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { Online, Offline } from 'react-detect-offline';
import Drawer from '~components/Drawer';
import ErrorDialog from '~components/ErrorDialog';
import OfflinePage from '~pages/OfflinePage';
import theme from './styles/theme';
import routes from './routes';
import { globalStore, modulesStore, observer } from '~store';
import {
  getModules, getCurrentAccount, loadTags, loadCtVersions,
} from '~api';

@observer
export default class App extends React.Component {
  public componentDidMount = async (): Promise<void> => {
    if (modulesStore.modules.length === 0) {
      getModules();
      getCurrentAccount();
      loadTags();
      loadCtVersions();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
  }

  public render(): JSX.Element {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <Drawer>
            <Online>
              <ErrorDialog />
              <Switch>
                {routes.map(({ route, component, name }) => (
                  <Route
                    key={route}
                    path={route}
                    exact
                    render={({ match }) => {
                      globalStore.setDrawerTitle(name || match.params.module);

                      return component;
                    }}
                  />
                ))}
                <Redirect to="/modules" />
              </Switch>
            </Online>
            <Offline>
              <OfflinePage />
            </Offline>
          </Drawer>
        </Router>
      </ThemeProvider>
    );
  }
}
