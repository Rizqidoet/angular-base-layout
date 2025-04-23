export interface EmployeeDto {
  employee: DetailEmployeeDto[],
}

export interface DetailEmployeeDto {
  username: string,
  firstName:string,
  lastName:string,
  email:string,
  birthDate: Date,
  basicSalary: DoubleRange,
  status:string,
  group:string,
  description: Date
}