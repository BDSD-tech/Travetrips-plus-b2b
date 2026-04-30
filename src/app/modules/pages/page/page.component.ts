import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { SafeHtmlModule } from '../../../shared/safe-html.module';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [SafeHtmlModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent {
  
  Response: any=[];
  loading: boolean | undefined;

  constructor(private activatedRoute: ActivatedRoute,private commonService:CommonService,private serviceTitle: Title,private meta: Meta) {

        this.activatedRoute.paramMap.subscribe(params => {
            if(params.get('slug')) {
              this.GetPageDetail(params.get('slug'));
            }
        });
   }

  ngOnInit(): void {
  }

  GetPageDetail(slug:any)
  {
    this.loading=true;
    this.commonService.GetPagesDetails(slug).pipe().subscribe((response:any) => {
      this.loading=false;
      if(response['Error']['ErrorCode']==0)
      {
        if(response['Result'])
        {
          this.Response=response['Result'];
          this.serviceTitle.setTitle(response['Result']['Title']);
          this.meta.updateTag({ name: 'description', content: response['Result']['MetaDescription'] })
        }
        
      }
     
    });
  }

}
