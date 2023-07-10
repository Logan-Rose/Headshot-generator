import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { Observable, map, mergeMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  // Variable to store shortLink from api response
  shortLink: string = '';
  loading: boolean = false; // Flag variable
  file: File | null = null; // Variable to store file

  images$: Observable<any> | undefined;

  tmpImages = [
    {
      url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-YifivFT2ozpQ2XR1j4xOoKh2/user-8vA2PRRY4xRIcacQigN9JdGd/img-L3ZLgJpSNf7OT3KuiA3fHPD3.png?st=2023-07-10T04%3A04%3A59Z&se=2023-07-10T06%3A04%3A59Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-07-09T14%3A08%3A23Z&ske=2023-07-10T14%3A08%3A23Z&sks=b&skv=2021-08-06&sig=jTB6XjvWlptGIL8G43lSPHPeKkoaupD2VCNimgrXt3k%3D',
    },
    {
      url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-YifivFT2ozpQ2XR1j4xOoKh2/user-8vA2PRRY4xRIcacQigN9JdGd/img-V8V8Kc6SQ6174VQ9nLcPo5de.png?st=2023-07-10T04%3A04%3A59Z&se=2023-07-10T06%3A04%3A59Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-07-09T14%3A08%3A23Z&ske=2023-07-10T14%3A08%3A23Z&sks=b&skv=2021-08-06&sig=koGoBMh3BHfq%2BqRgWT8Pr40csP14Xuep24mU2ZjPxbo%3D',
    },
    {
      url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-YifivFT2ozpQ2XR1j4xOoKh2/user-8vA2PRRY4xRIcacQigN9JdGd/img-xNSWNHzHQVPwX1EEBjYZduAO.png?st=2023-07-10T04%3A04%3A59Z&se=2023-07-10T06%3A04%3A59Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-07-09T14%3A08%3A23Z&ske=2023-07-10T14%3A08%3A23Z&sks=b&skv=2021-08-06&sig=Ky5vjdsEJ/W%2B0ngHQH9TrHnMEysRWkjqxUWRxt0j72w%3D',
    },
    {
      url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-YifivFT2ozpQ2XR1j4xOoKh2/user-8vA2PRRY4xRIcacQigN9JdGd/img-2XpkIPsjuQbRmoZ8KrblHGBf.png?st=2023-07-10T04%3A04%3A59Z&se=2023-07-10T06%3A04%3A59Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-07-09T14%3A08%3A23Z&ske=2023-07-10T14%3A08%3A23Z&sks=b&skv=2021-08-06&sig=cjlO8QteZbefTo5JxO6xcJIaYWO470sny1tyDbtxT30%3D',
    },
    {
      url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-YifivFT2ozpQ2XR1j4xOoKh2/user-8vA2PRRY4xRIcacQigN9JdGd/img-KouLldfT6T8KIRY5f8GcxcGX.png?st=2023-07-10T04%3A04%3A59Z&se=2023-07-10T06%3A04%3A59Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-07-09T14%3A08%3A23Z&ske=2023-07-10T14%3A08%3A23Z&sks=b&skv=2021-08-06&sig=Rdph34m%2BrGFl69rCaZcQ8VP7G%2BjuJIshBcUXfJ5s%2By0%3D',
    },
  ];

  // Inject service
  constructor(
    private fileUploadService: FileUploadService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  // On file Select
  onChange(event: any) {
    this.file = event.target.files[0];
  }

  // OnClick of button Upload
  onUpload() {
    this.loading = !this.loading;
    console.log(this.file);
    this.images$ = this.fileUploadService.upload(this.file).pipe(
      map((event: any) => {
        if (typeof event === 'object') {
          return event.key;
        } else {
          throw new Error('File store failed');
        }
      }),
      mergeMap((imageId) => {
        return this.http.get(`http://127.0.0.1:8000/headshot/${imageId}`);
      }),
      tap((x) => {
        console.log(x);
      })
    );
    // this.fileUploadService.upload(this.file).subscribe((event: any) => {
    //   if (typeof event === 'object') {
    //     // Short link via api response
    //     this.shortLink = event.link;
    //     debugger;
    //     this.loading = false; // Flag variable
    //   }
    // });
  }

  // Using fetch
  async downloadImage(imageSrc: string) {
    const image = await fetch(imageSrc);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'image file name here';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
