export interface MainMenuDto {
  label: string,
  path: string,
  isActive: boolean,
}

export interface ErrorMessage {
  statusCode: number;
  message: string;
}