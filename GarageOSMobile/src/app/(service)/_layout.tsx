import { Tabs } from 'expo-router/js-tabs';

import { ServiceTabBar } from '@/components/service-tab-bar';

export default function ServiceLayout() {
  return (
    <Tabs tabBar={(props) => <ServiceTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="garage" />
      <Tabs.Screen name="work" />
      <Tabs.Screen name="money" />
    </Tabs>
  );
}
