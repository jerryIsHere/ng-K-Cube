import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-file-path-bar',
  templateUrl: './file-path-bar.component.html',
  styleUrls: ['./file-path-bar.component.css']
})
export class FilePathBarComponent implements OnInit {
  @Input() paths: Array<{text: string, route: string, query: any}> = []
  constructor() { }

  ngOnInit(): void {
  }

}
