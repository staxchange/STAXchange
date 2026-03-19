import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="exchange" options={{ title: 'Exchange' }} />
      <Tabs.Screen name="market" options={{ title: 'Market' }} />
      <Tabs.Screen name="vault" options={{ title: 'Vault' }} />
      <Tabs.Screen name="trade-board" options={{ title: 'Trade Board' }} />
      <Tabs.Screen name="break-room" options={{ title: 'Break Room' }} />
    </Tabs>
  );
}
