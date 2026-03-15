import AppNavigator from "./navigation/AppNavigator";

function startApp() {
  const app = AppNavigator();
  console.log("STAX App Started");
  console.log(Object.keys(app));
}

startApp();
