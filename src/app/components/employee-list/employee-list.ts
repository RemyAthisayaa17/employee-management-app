
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmployeeService } from '../../services/employee';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList implements OnInit {

  employees: Employee[] = [];

  showForm = false;

  selectedEmployee: Employee | null = null;

  isEditMode = false;

  editingEmployeeId: number | null = null;

  editingCreatedDate = '';

  employee = {
    employeeName: '',
    emailId: '',
    contactNo: '',
    deptId: 0,
    password: '',
    gender: '',
    role: ''
  };

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  // Load employees when component initializes
  ngOnInit(): void {
    this.getEmployees();
  }

  // GET: Get all employees
  getEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;

        console.log('Employee Count:', this.employees.length);
        console.log('First Employee:', this.employees[0]);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        alert('Failed to load employees.');
      }
    });
  }

  // Open add employee form
  openAddForm(): void {
    this.resetForm();
    this.isEditMode = false;
    this.showForm = true;
  }

  // Return to employee list
  backToList(): void {
    this.resetForm();
    this.showForm = false;
  }

  // GET: Get employee by ID
  viewEmployee(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.selectedEmployee = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching employee:', error);
        alert('Failed to load employee details.');
      }
    });
  }

  // Close employee details
  closeView(): void {
    this.selectedEmployee = null;
  }

  // Open employee form for editing
  editEmployee(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {

        this.editingEmployeeId = data.employeeId;
        this.editingCreatedDate = data.createdDate;

        this.employee = {
          employeeName: data.employeeName,
          emailId: data.emailId,
          contactNo: data.contactNo,
          deptId: data.deptId,
          password: data.password,
          gender: data.gender,
          role: data.role
        };

        this.isEditMode = true;
        this.showForm = true;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching employee for editing:', error);
        alert('Failed to load employee for editing.');
      }
    });
  }

  // POST: Create employee / PUT: Update employee
  onSubmit(): void {

    const employeeData: Employee = {
      employeeId:
        this.isEditMode && this.editingEmployeeId !== null
          ? this.editingEmployeeId
          : 0,

      ...this.employee,

      createdDate: this.isEditMode
        ? this.editingCreatedDate
        : new Date().toISOString()
    };

    if (this.isEditMode && this.editingEmployeeId !== null) {

      // PUT: Update employee
      this.employeeService.updateEmployee(
        this.editingEmployeeId,
        employeeData
      ).subscribe({
        next: () => {
          console.log('Employee updated successfully');
          alert('Employee updated successfully!');

          this.resetForm();
          this.showForm = false;
          this.getEmployees();
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          alert('Failed to update employee.');
        }
      });

    } else {

      // POST: Create employee
      this.employeeService.createEmployee(employeeData).subscribe({
        next: (response) => {
          console.log('Employee created successfully:', response);
          alert('Employee created successfully!');

          this.resetForm();
          this.showForm = false;
          this.getEmployees();
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          alert('Failed to create employee.');
        }
      });

    }
  }

  // Reset employee form
  resetForm(): void {
    this.employee = {
      employeeName: '',
      emailId: '',
      contactNo: '',
      deptId: 0,
      password: '',
      gender: '',
      role: ''
    };

    this.editingEmployeeId = null;
    this.editingCreatedDate = '';
    this.isEditMode = false;
  }

//Delete
deleteEmployee(id: number): void {

  const confirmed = confirm(
    'Are you sure you want to delete this employee?'
  );

  if (!confirmed) {
    return;
  }

  this.employeeService.deleteEmployee(id).subscribe({
    next: () => {
      console.log('Employee deleted successfully:', id);
      alert('Employee deleted successfully!');
      this.getEmployees();
    },
    error: (error) => {
      console.error('DELETE API Error Details:', error);
      console.log('Status Code:', error.status);
      console.log('Error Message:', error.message);
      console.log('Server Response:', error.error);

      alert('Failed to delete employee. Check the console.');
    }
  });
}

}