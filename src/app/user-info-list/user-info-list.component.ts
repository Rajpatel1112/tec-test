import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-balham.css';
import { provideGlobalGridOptions } from 'ag-grid-community';

provideGlobalGridOptions({ theme: 'legacy' });

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
ModuleRegistry.registerModules([AllCommunityModule]);
import { RowData, State, District } from '../model/user-info.model';

@Component({
  selector: 'app-user-info-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    AgGridAngular,
    MatToolbarModule,
    MatInputModule,
    MatMenuModule
  ],
  templateUrl: './user-info-list.component.html',
  styleUrls: ['./user-info-list.component.css'],
})
export class UserInfoListComponent implements OnInit {
  isLogged: boolean = false;
  items$: Observable<any[]>;
  recordForm: FormGroup;
  editingIndex: number | null = null;

  states: State[] = [
    { code: 'CA', name: 'California' },
    { code: 'TX', name: 'Texas' },
    { code: 'NY', name: 'New York' },
  ];

  districts: District[] = [
    { code: 'LA', name: 'Los Angeles', stateCode: 'CA' },
    { code: 'SF', name: 'San Francisco', stateCode: 'CA' },
    { code: 'DAL', name: 'Dallas', stateCode: 'TX' },
    { code: 'HOU', name: 'Houston', stateCode: 'TX' },
    { code: 'NYC', name: 'New York City', stateCode: 'NY' },
    { code: 'BUF', name: 'Buffalo', stateCode: 'NY' },
  ];

  filteredDistricts: District[] = [];
  rowData: RowData[] = [];

  columnDefs: ColDef<RowData>[] = [
    {
      floatingFilter: false,
      headerName: 'Action',
      width: 80,
      cellRenderer: () => `<span class="material-icons" style="cursor:pointer;">edit</span>`,
      onCellClicked: (params: any) => {
        this.onEdit(params.data);
      },
    },
    { headerName: 'First Name', field: 'firstName' },
    { headerName: 'Last Name', field: 'lastName' },
    { headerName: 'Phone', field: 'phone' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Address', field: 'address' },
    { headerName: 'State', field: 'state' },
    { headerName: 'District', field: 'district' },
    { headerName: 'City', field: 'city' },
    { headerName: 'Zip', field: 'zip' },
  ];

  gridOptions = {
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      filter: true,
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
    suppressAutoSize: true,
    pagination: true,
    paginationPageSize: 8,
    paginationPageSizeSelector: [5, 8, 10, 20, 50],

  };



  constructor(private fb: FormBuilder, private http: HttpClient, private dataService: DataService, private router: Router,
    private authService: AuthService) {
    this.items$ = this.dataService.getItems();
    this.isLogged = this.authService.isAuthenticated();
    this.recordForm = this.fb.group({
      firstName: ['',],
      lastName: ['',],
      phone: ['', [Validators.required, Validators.pattern(/^\(\d{3}\)-\d{3}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['',],
      state: ['',],
      district: ['',],
      city: ['',],
      zip: ['',[Validators.pattern(/^\d{5}$/)]],
    });
  }

  ngOnInit() {
    // this.loadUserData();
    this.dataService.getItems().subscribe(data => {
      this.rowData = data;
      console.log('Firestore data loaded:', data);
    });
  }

  onStateChange(stateCode: string) {
    this.filteredDistricts = this.districts.filter((d) => d.stateCode === stateCode);
    this.recordForm.patchValue({ district: null });
  }

  onEdit(row: RowData) {
    this.editingIndex = this.rowData.findIndex((r) => r === row);
    let formattedPhone = row.phone;
    if (formattedPhone) {
      const digits = formattedPhone.replace(/\D/g, '');
      if (digits.length === 10) {
        formattedPhone = `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
    }

    this.recordForm.patchValue({
      ...row,
      phone: formattedPhone,
    });

    this.filteredDistricts = this.districts.filter((d) => d.stateCode === row.state);
  }

  formatPhone(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 3 && input.length <= 6) {
      input = `(${input.slice(0, 3)})-${input.slice(3)}`;
    } else if (input.length > 6) {
      input = `(${input.slice(0, 3)})-${input.slice(3, 6)}-${input.slice(6, 10)}`;
    }
    this.recordForm.get('phone')?.setValue(input, { emitEvent: false });
  }

  onSave() {
    if (this.recordForm.valid) {
      const formValue = this.recordForm.value;
      if (formValue.phone) {
        formValue.phone = formValue.phone.replace(/\D/g, '');
      }

      if (this.editingIndex !== null && this.rowData[this.editingIndex]?.id) {
        // EDIT MODE - Update existing document in Firestore
        const id = this.rowData[this.editingIndex].id;
        this.dataService.updateItem(id, formValue)
          .then(() => {
            console.log('Record updated successfully in Firestore');
            this.recordForm.reset();
            this.filteredDistricts = [];
            this.editingIndex = null;
          })
          .catch(error => console.error('Error updating record:', error));

      } else {
        // ADD MODE - Create new document in Firestore
        this.dataService.createItem(formValue)
          .then(() => {
            console.log('Record added successfully to Firestore');
            this.recordForm.reset();
            this.filteredDistricts = [];
          })
          .catch(error => console.error('Error adding record:', error));
      }

    } else {
      // this.recordForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.recordForm.reset();
    this.filteredDistricts = [];
    this.editingIndex = null;
  }

  get saveButtonLabel() {
    return this.editingIndex !== null ? 'Update' : 'Save';
  }

  onLogout(): void {
    this.authService.logout();
    this.isLogged = false;
    this.router.navigate(['/login']);
  }

}
