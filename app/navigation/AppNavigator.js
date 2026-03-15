import HomeScreen from "../screens/HomeScreen";
import VaultScreen from "../screens/VaultScreen";
import ScanScreen from "../screens/ScanScreen";
import TradeScreen from "../screens/TradeScreen";
import ProfileScreen from "../screens/ProfileScreen";

export default function AppNavigator() {
  return {
    HomeScreen,
    VaultScreen,
    ScanScreen,
    TradeScreen,
    ProfileScreen
  };
}
