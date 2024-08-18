import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router'; // Import the Router here
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MasterService } from '../services/master.service';

export interface UserData {
  _id: string;
  CourseName: string;
  University: string;
  City: string;
  Country: string;
  CourseDescription: string;
  StartDate: string;
  EndDate: string;
  Price: number;
  Currency: string;
}

@Component({
  selector: 'app-edit-entry',
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
  ],
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.css'],
})
export class EditEntryComponent implements OnInit {
  public courseId: string | null = null;

  courseName: string = '';
  currency: string = '';
  university: string = '';
  country: string = '';
  city: string = '';
  price: number = 0;
  startDate: string = '';
  endDate: string = '';
  courseDescription: string = '';

  auto_data: UserData[] = [];

  onSubmit(): void {
    console.log('lllllllll', this.userForm.errors);

    if (this.userForm.errors == null) {
      console.log('Valid form');

      // this.masterService.
    }
    // const startDateValue: string | null | undefined =
    //   this.userForm.value.StartDate;
    // const endDateValue: string | null | undefined = this.userForm.value.EndDate;

    // if (startDateValue) {
    //   const formattedStartDate = this.formatDate(new Date(startDateValue));
    //   console.log('Formatted Start Date:', formattedStartDate);
    //   this.userForm.patchValue({ StartDate: formattedStartDate });
    // } else {
    //   console.error('Start Date is not defined.');
    // }

    // if (endDateValue) {
    //   const formattedEndDate = this.formatDate(new Date(endDateValue));
    //   console.log('Formatted End Date:', formattedEndDate);
    //   this.userForm.patchValue({ EndDate: formattedEndDate });
    // } else {
    //   console.error('End Date is not defined.');
    // }

    // if (this.userForm.errors == null) {
    //   console.log('Form is valid:', this.userForm.value);
    //   // Add logic to save or update the course
    //   this.masterService.postCourse(this.userForm.value).subscribe(
    //     (response) => {
    //       console.log('Course saved successfully:', response);
    //       // You can add more logic here, like resetting the form or redirecting
    //     },
    //     (error) => {
    //       console.error('Error saving course:', error);
    //       // Handle the error here, such as showing a message to the user
    //     }
    //   );
    // } else {
    //   console.log('Form is invalid:', this.userForm.value);
    // }
  }

  loadUserData(): void {
    this.masterService.LoadPage().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.auto_data = data;
          console.log('Data loaded successfully:', this.auto_data);
        } else {
          console.error('Received data is not an array:', data);
        }
      },
      error: (error) => {
        console.error('Error fetching universities:', error);
      },
      complete: () => {
        console.info('Data loading complete', this.auto_data.length);
        var courseId = this.route.snapshot.paramMap.get('id');

        for (let i = 0; i < this.auto_data.length; i++) {
          console.log(this.auto_data[i]['_id'], courseId);

          if (this.auto_data[i]['_id'] == courseId) {
            console.log('Yaas', this.auto_data[i]['University']);
            this.university = this.auto_data[i]['University'];
            this.city = this.auto_data[i]['City'];
            this.country = this.auto_data[i]['Country'];
            this.courseDescription = this.auto_data[i]['CourseName'];
            this.price = this.auto_data[i]['Price'];
            this.currency = this.auto_data[i]['Currency'];
            this.startDate = this.auto_data[i]['StartDate'];
            this.endDate = this.auto_data[i]['EndDate'];
            this.courseDescription = this.auto_data[i]['CourseDescription'];
          } else {
            console.log('Not found');
          }
        }

        // Load form here
      },
    });
  }

  goback() {
    this.router.navigate(['/']);
  }

  searchRecordById(id: string): any | undefined {
    console.log(this.auto_data.find((item: any) => item._id === id));
    return this.auto_data.find((item: any) => item._id === id);
  }

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

  // Helper method to format the date to 'yyyy-MM-dd'
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  constructor(
    private route: ActivatedRoute,
    private masterService: MasterService,
    private router: Router
  ) {
    this.loadUserData();
  }

  ngOnInit(): void {
    // Get the 'id' parameter from the route
    this.courseId = this.route.snapshot.paramMap.get('id');
    console.log('Course ID:', this.courseId);

    // this.searchRecordById(this.courseId)

    console.log('Obtained data is', this.auto_data);
  }
}
