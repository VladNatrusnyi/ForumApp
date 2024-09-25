import 'react-native-gesture-handler';
import React, {useEffect} from "react";
import {PageLayout} from "./src/layouts/PageLayout";
import {store} from "./src/store";
import {RootNavigator} from "./src/navigation/RootNavigator";
import {Provider} from "react-redux";

const App = () => {

  return (
      <Provider store={store} >
        <PageLayout>
          <RootNavigator />
        </PageLayout>
      </Provider>
  );
};

export default App;

