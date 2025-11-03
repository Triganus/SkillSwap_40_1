export type ImageInputFile = {
  file: File;
  url: string;
};

export type ImageInputProps = {
  multiple?: boolean;
  accept?: string; // e.g. 'image/*'
  ariaLabel?: string;
  className?: string;
  onFilesChange: (files: File[]) => void;
  initialFiles?: File[]; // optional prefilled files
};
