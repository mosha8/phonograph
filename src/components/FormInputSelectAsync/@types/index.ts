import type { ControllerRenderProps, FieldError } from 'react-hook-form';

export interface InputSelectItem {
  value: string;
  label: string;
  isDisabled?: boolean;
}

export interface GroupInputSelect {
  label: string;
  options: InputSelectItem[];
}

export interface FormInputSelectProps {
  defaultOptions: GroupInputSelect[];
  loadOptions: (inputValue: string) => Promise<GroupInputSelect[]>;
  name: string;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  isSearchable?: boolean;
}

export interface InputSelectProps
  extends FormInputSelectProps,
    Pick<ControllerRenderProps, 'onChange' | 'value' | 'ref'> {
  error?: string | FieldError;
}
