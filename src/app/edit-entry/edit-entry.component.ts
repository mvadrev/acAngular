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

  auto_data: any;
  auto_city: any;
  isMode: boolean = false;

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

  async loadUserData(): Promise<UserData[]> {
    try {
      const data = await this.masterService.LoadPage().toPromise(); // Convert Observable to Promise
      if (Array.isArray(data)) {
        return data; // Return the data if it's correctly an array
      } else {
        console.error('Received data is not an array:', data);
        return []; // Return an empty array if the data is not in the expected format
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
      return []; // Return an empty array in case of an error
    }
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
  ) {}

  ngOnInit(): void {
    // Get the 'id' parameter from the route
    this.courseId = this.route.snapshot.paramMap.get('id');
    console.log('Course ID:', this.courseId);

    // this.searchRecordById(this.courseId)
  }
}
