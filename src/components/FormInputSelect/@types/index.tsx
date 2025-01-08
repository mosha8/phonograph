import type { ControllerRenderProps, FieldError } from 'react-hook-form';

export interface InputSelectItem {
  value: string;
  label: string;
  isDisabled?: boolean;
}

export interface FormInputSelectProps {
  name: string;
  options: InputSelectItem[];
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  isSearchable?: boolean;
  isMulti?: boolean;
}

export interface InputSelectProps
  extends FormInputSelectProps,
    Pick<ControllerRenderProps, 'onChange' | 'value' | 'ref'> {
  error?: string | FieldError;
}
