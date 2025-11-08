import { ReportFormModalProps, ReportFormData, ReportFormErrors, ReportCategory } from '../../types/report';

export const CATEGORIES: ReportCategory[] = ['Food', 'Personal Hygiene', 'Clothing', 'School Supplies'];

export const validateForm = ({title, description, imageUri, category}: any): ReportFormErrors => {
  const TITLE_MAX_LENGTH = 100;
  const DESCRIPTION_MAX_LENGTH = 500;

  const newErrors: ReportFormErrors = {};

  if (!title.trim()) {
    newErrors.title = 'Title is required';
  } else if (title.length > TITLE_MAX_LENGTH) {
    newErrors.title = `Title must be ${TITLE_MAX_LENGTH} characters or less`;
  }

  if (!description.trim()) {
    newErrors.description = 'Description is required';
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    newErrors.description = `Description must be ${DESCRIPTION_MAX_LENGTH} characters or less`;
  }

  if (!category) {
    newErrors.category = 'Category is required';
  }

  return newErrors;

  // setErrors(newErrors);
  // return Object.keys(newErrors).length === 0;
};