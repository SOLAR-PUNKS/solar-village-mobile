import { StyleSheet, Text, Switch, View } from 'react-native';
import { Colors } from '../theme';

type Props = {
  label: string;
  onChange: (value: boolean) => void;
  value: boolean;
}

const SettingsToggle = ({label, onChange, value}: Props) => {
  return <>
    <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#d3d3d3', true: '#7fb069' }}
        thumbColor={value ? Colors.primary : '#f4f3f4'}
        ios_backgroundColor="#d3d3d3"
        />
    </View>
  </>;
};

const styles = StyleSheet.create({
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    toggleLabel: {
      fontSize: 16,
      color: '#333',
      fontWeight: '500',
    },
  });
  
export default SettingsToggle;
