import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Chart } from 'chart.js';

interface EmployeeEntry {
  Id: string;
  EmployeeName: string;
  StarTimeUtc: string;
  EndTimeUtc: string;
  EntryNotes: string;
  DeletedOn: string | null;
}

interface Employee {
  EmployeeName: string;
  TotalWorkTime: number;
}

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.css',
})
export class EmployeeTableComponent implements OnInit {
  dataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>();
  displayedColumns: string[] = ['employeeName', 'totalTimeWorked', 'actions'];
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  pieChart: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<EmployeeEntry[]>(
        'https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ=='
      )
      .subscribe((entries) => {
        const employeeMap = new Map<string, number>();

        entries.forEach((entry) => {
          const startTime = new Date(entry.StarTimeUtc);
          const endTime = new Date(entry.EndTimeUtc);
          const timeDifference = endTime.getTime() - startTime.getTime();
          const hoursWorked = timeDifference / (1000 * 60 * 60);

          if (!employeeMap.has(entry.EmployeeName)) {
            employeeMap.set(entry.EmployeeName, 0);
          }

          employeeMap.set(
            entry.EmployeeName,
            employeeMap.get(entry.EmployeeName)! + hoursWorked
          );
        });

        this.dataSource.data = Array.from(employeeMap.entries())
          .map(([name, totalWorkTime]) => ({
            EmployeeName: name,
            TotalWorkTime: totalWorkTime,
          }))
          .sort((a, b) => b.TotalWorkTime - a.TotalWorkTime);
      });
  }


}
