
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'https://projectapi.gerasim.in/api/EmployeeManagement';

  constructor(private http: HttpClient) {}

  // GET: Get all employees
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/GetAllEmployees`);
  }

  // GET: Get employee by ID
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/GetEmployee/${id}`);
  }

  // POST: Create employee
  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(
      `${this.apiUrl}/CreateEmployee`,
      employee
    );
  }


  // PUT: Update employee
  updateEmployee(id: number, employee: Employee): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/UpdateEmployee/${id}`,
      employee
    );
  }


  // DELETE: Delete employee
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/DeleteEmployee/${id}`
    );
  }


}
