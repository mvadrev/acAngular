import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MasterService } from '../../services/master.service';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router'; // Import the Router here

export interface UserData {
  _id: string;
  CourseName: string;
  // University: string;
  City: string;
  Country: string;
  CourseDescription: string;
  StartDate: Date;
  EndDate: Date;
  Price: number;
  Currency: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'actions',
    // 'University',
    'CourseName',
    'Country',
    // 'City',
    // 'CourseDescription',
    'StartDate',
    // 'EndDate',
    'Price',
    // 'Currency',
  ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private masterService: MasterService, private router: Router) {
    this.dataSource = new MatTableDataSource<UserData>([]); // Explicitly specify UserData type
    this.loadUserData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  loadUserData() {
    this.masterService.LoadPage().subscribe(
      (data: any) => {
        console.log(data);
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Error fetching universities:', error);
      }
    );
  }
}
