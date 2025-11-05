/**
 * Report form data types
 */

export interface ReportFormData {
  title: string;
  description: string;
  imageUri: string | null;
}

export interface ReportFormErrors {
  title?: string;
  description?: string;
}

export interface ReportFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ReportFormData) => void;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  type: ToastType;
  message: string;
  visible: boolean;
}

