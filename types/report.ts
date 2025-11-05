/**
 * Report form data types
 */

export type ReportCategory = 'Food' | 'Personal Hygiene' | 'Clothing' | 'School Supplies';

export interface ReportFormData {
  title: string;
  description: string;
  category: ReportCategory | null;
  imageUri: string | null;
}

export interface ReportFormErrors {
  title?: string;
  description?: string;
  category?: string;
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

