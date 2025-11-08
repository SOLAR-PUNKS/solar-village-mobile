import { StyleSheet, Text } from 'react-native';
import { Colors } from '../theme';

const Required = () => (
  <Text style={styles.required}>*</Text>
)

export default Required;

const styles = StyleSheet.create({
  required: {
    color: Colors.error,
  },
});