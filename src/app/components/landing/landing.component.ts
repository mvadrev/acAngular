import { AfterViewInit, ViewChild, Component, ElementRef } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MasterService } from '../../services/master.service';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router'; // Import the Router here
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Modal } from 'bootstrap'; //

export interface UserData {
  _id: string;
  CourseName: string;
  // University: string;
  City: string;
  Country: string;
  CourseDescription: string;
  StartDate: string;
  EndDate: string;
  Price: number;
  Currency: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatTooltipModule,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'actions',
    'CourseName',
    'Country',
    'StartDate',
    'Price',
  ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isMode: boolean = true; // Tracks which mode (view or edit) is active
  universities_ac: any;
  auto_data: any;
  auto_city: any;

  userForm = new FormGroup({
    CourseName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(120),
    ]),
    Currency: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3),
    ]),
    University: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(120),
    ]),
    Country: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(120),
    ]),
    City: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(120),
    ]),
    Price: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'),
    ]),
    StartDate: new FormControl('', [Validators.required]),
    EndDate: new FormControl('', [Validators.required]),
    CourseDescription: new FormControl('', [
      Validators.required,
      Validators.minLength(110),
    ]),
  });

  courseName: string = '';
  currency: string = '';
  university: string = '';
  country: string = '';
  city: string = '';
  price: number = 0;
  startDate: string = '';
  endDate: string = '';
  courseDescription: string = '';
  showDescription: boolean = false;

  constructor(private masterService: MasterService, private router: Router) {
    this.dataSource = new MatTableDataSource<UserData>([]);
    this.loadUserData();
  }

  //
  assigner_var: any;
  assigner_(_id: any) {
    this.assigner_var = _id;
  }

  cancelAdd() {
    this.isMode = true;
  }

  async ngOnInit() {
    try {
      this.auto_data = await this.loadUserData();
      console.log('Obtained data is', this.auto_data);
      this.dataSource.data = this.auto_data; // Assign the data to the dataSource
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  // Helper method to format the date to 'yyyy-MM-dd'
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  delete_rec(assigner_var: any) {
    console.log('Deleting course with ID:', assigner_var);

    this.masterService
      .deleteCourse(assigner_var)
      .then((response) => {
        console.log('Course deleted successfully:', response);

        // Simulate a click on the close button to close the modal
        const closeButton = document.querySelector(
          'button.btn-muk'
        ) as HTMLButtonElement;
        if (closeButton) {
          closeButton.click(); // Programmatically click the close button
        } else {
          console.error('Close button not found!');
        }

        // Reload the data after closing the modal
        this.loadUserData();
      })
      .catch((error) => {
        console.error('Error deleting course:', error);
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Listen to paginator changes
    this.paginator.page.subscribe(() => {
      const pageIndex = this.paginator.pageIndex + 1; // MatPaginator is 0-based, your API might be 1-based
      const pageSize = this.paginator.pageSize;
      this.loadUserData(pageIndex, pageSize); // Fetch data for the current page
    });
  }

  onSubmit(): void {
    console.log(this.userForm.errors);
    const startDateValue: string | null | undefined =
      this.userForm.value.StartDate;
    const endDateValue: string | null | undefined = this.userForm.value.EndDate;

    if (startDateValue) {
      const formattedStartDate = this.formatDate(new Date(startDateValue));
      console.log('Formatted Start Date:', formattedStartDate);
      this.userForm.patchValue({ StartDate: formattedStartDate });
    } else {
      console.error('Start Date is not defined.');
    }

    if (endDateValue) {
      const formattedEndDate = this.formatDate(new Date(endDateValue));
      console.log('Formatted End Date:', formattedEndDate);
      this.userForm.patchValue({ EndDate: formattedEndDate });
    } else {
      console.error('End Date is not defined.');
    }

    if (this.userForm.errors == null) {
      console.log('Form is valid:', this.userForm.value);
      // Add logic to save or update the course
      this.masterService.postCourse(this.userForm.value).subscribe(
        (response) => {
          console.log('Course saved successfully:', response);
          this.isMode = true;
          // You can add more logic here, like resetting the form or redirecting
        },
        (error) => {
          console.error('Error saving course:', error);
          // Handle the error here, such as showing a message to the user
        }
      );
    } else {
      console.log('Form is invalid:', this.userForm.value);
    }
  }

  addNewCourse() {
    console.log('adding');
    this.isMode = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEditAction(id: string) {
    this.router.navigate(['/update-course', id]);
    console.log('hey');
  }

  // loadUserData(): void {
  //   this.masterService.LoadPage().subscribe({
  //     next: (data: any) => {
  //       if (Array.isArray(data)) {
  //         this.auto_data = data;
  //         console.log('Data loaded successfully:', this.auto_data);
  //       } else {
  //         console.error('Received data is not an array:', data);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error fetching universities:', error);
  //     },
  //     complete: () => {
  //       console.info('Data loading complete', this.auto_data.length);
  //       // var courseId = this.route.snapshot.paramMap.get('id');

  //       this.auto_data = data

  //       // for (let i = 0; i < this.auto_data.length; i++) {
  //       //   console.log(this.auto_data[i]['_id']);

  //       // }

  //       // Load form here
  //     },
  //   });
  // }

  loadUserData(page: number = 1, limit: number = 10): void {
    this.masterService.getPaginatedAllCourses(page, limit).subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.dataSource.data = data; // Assign data to the dataSource
          console.log('Data loaded successfully:', data);
        } else {
          console.error('Received data is not an array:', data);
        }
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
      },
      complete: () => {
        console.info('Data loading complete');
      },
    });
  }
}
