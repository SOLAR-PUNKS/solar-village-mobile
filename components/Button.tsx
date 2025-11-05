import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  primary?: boolean;
}

export const Button = ({label, onPress, primary}: Props) => {
  return <>
    <TouchableOpacity
      style={primary
        ? [styles.button, styles.primaryButton]
        : styles.button
      }
      onPress={onPress}
    >
      <Text
        style={primary
          ? [styles.buttonText, styles.primaryButtonText]
          : styles.buttonText
        }
      >
        {label}
      </Text>
    </TouchableOpacity>
  </>
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f0f0f0',
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
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#2d5016',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
});

export default Button;
