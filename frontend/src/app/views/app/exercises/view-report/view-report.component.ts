import { Component, OnInit } from '@angular/core';
import { SenderService } from 'src/app/data/sender.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss']
})
export class ViewReportComponent implements OnInit {

  constructor(private sender: SenderService) { }

  ngOnInit(): void {
    console.log(this.sender);
  }

}
