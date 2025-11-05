import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
}

const PrimaryButton = ({label, onPress}: Props) => {
  return <>
    <TouchableOpacity style={styles.applyButton} onPress={onPress}>
      <Text style={styles.applyButtonText}>{label}</Text>
    </TouchableOpacity>
  </>
}

const styles = StyleSheet.create({
  applyButton: {
    backgroundColor: '#2d5016',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PrimaryButton;
