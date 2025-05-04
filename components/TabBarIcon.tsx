import { Foundation } from '@expo/vector-icons';

import { StyleSheet } from 'react-native';

export const TabBarIcon = (props: {
  name: React.ComponentProps<typeof Foundation>['name'];
  color: string;
}) => {
  return <Foundation size={28} style={styles.tabBarIcon} {...props} />;

};

export const styles = StyleSheet.create({
  tabBarIcon: {
    marginBottom: -3,
  },
});
