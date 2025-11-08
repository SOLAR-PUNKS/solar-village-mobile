import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ReportType } from '../types/report';
import { REPORT_TYPES } from './ReportFormModal/utils';
import { Colors } from '../theme';
import { Required } from '.';

type Props = {
  onSelectionChange: (type: ReportType) => void;
  type: ReportType;
}

const ReportTypeSelector = ({onSelectionChange, type}: Props) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>
      Type <Required />
    </Text>
    <View style={styles.typeSelector}>
      {REPORT_TYPES.map((reportType) => (
        <TouchableOpacity
          key={reportType}
          style={[
            styles.typeButton,
            type === reportType && styles.typeButtonSelected,
          ]}
          onPress={() => onSelectionChange(reportType as ReportType)}
        >
          <Text
            style={[
              styles.typeButtonText,
              type === reportType && styles.typeButtonTextSelected,
            ]}
          >
            {reportType}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
)

export default ReportTypeSelector;

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d3d3d3',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  typeButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextSelected: {
    color: Colors.text.primary,
  },
});