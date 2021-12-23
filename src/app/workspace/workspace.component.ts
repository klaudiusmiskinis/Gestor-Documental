import { Component, OnInit } from '@angular/core';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html'
})

export class WorkspaceComponent implements OnInit {
  public content: any = {}
  public path: string;
  constructor(private request: RequestService) { 
    this.path = 'http://localhost:3001';
  }

  ngOnInit(): void {
    this.getService();
  }

  async getService() {
    this.content = await this.request.getWorkspace();
    console.log(this.content)
  }

}
