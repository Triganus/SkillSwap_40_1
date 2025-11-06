export type ImageInputFile = {
  file: File;
  url: string;
};

export type ImageInputProps = {
  multiple?: boolean;
  accept?: string;
  ariaLabel?: string;
  className?: string;
  onFilesChange: (files: File[]) => void;
  initialFiles?: File[];
  initialDataUrls?: string[];
};
