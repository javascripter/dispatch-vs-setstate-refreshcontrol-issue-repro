import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Switch
} from "react-native";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";

// reducer based refreshing prop
const initState = {
  refreshing: false
};

const store = createStore((state = initState, action) => {
  switch (action.type) {
    case "SET_REFRESHING":
      return { ...state, refreshing: action.payload };
    default:
      return state;
  }
});

// normal flatlist using useState / setState
function FlatListWithState() {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <FlatList
      data={["Scroll Down to Pull To Refresh (using local state)"]}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);

        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
      }}
      style={styles.container}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <Text>{item}</Text>}
    />
  );
}

// flatlist with refreshing prop from redux using connect()

const FlatListWithReactRedux = connect(state => state)(props => {
  return (
    <FlatList
      data={["Scroll Down to Pull To Refresh (using redux/react-redux)"]}
      refreshing={props.refreshing}
      onRefresh={() => {
        props.dispatch({
          type: "SET_REFRESHING",
          payload: true
        });
        setTimeout(() => {
          props.dispatch({
            type: "SET_REFRESHING",
            payload: false
          });
        }, 1000);
      }}
      style={styles.container}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <Text>{item}</Text>}
    />
  );
});

// connect() needs to be nested for for this issue to occur

const MyApp = connect(state => state)(() => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatListWithState />
      <FlatListWithReactRedux />
    </SafeAreaView>
  );
});

export default function App() {
  return (
    <Provider store={store}>
      <MyApp />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
