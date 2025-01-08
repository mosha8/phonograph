import type { ControllerRenderProps, FieldError } from 'react-hook-form';

export interface InputAsyncSelectItem {
  value: string;
  label: string;
  category: string;
  isDisabled?: boolean;
}

export interface GroupInputSelect {
  label: string;
  options: InputAsyncSelectItem[];
}

export interface FormInputSelectProps {
  defaultOptions: GroupInputSelect[];
  loadOptions: (inputValue: string) => Promise<GroupInputSelect[]>;
  name: string;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  cacheOptions?: boolean;
}

export interface InputSelectProps
  extends FormInputSelectProps,
    Pick<ControllerRenderProps, 'onChange' | 'value' | 'ref'> {
  error?: string | FieldError;
}
