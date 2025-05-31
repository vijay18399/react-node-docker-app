import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-linkedin-callback',
  standalone: true,
  template: `<p>Logging in with LinkedIn...</p>`,
})
export class LinkedinCallbackComponent implements OnInit {
  linkedInToken: any;
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
     this.linkedInToken = this.route.snapshot.queryParams["code"];
      this.authService.signInWithLinkedIn(this.linkedInToken).subscribe(res => {
        localStorage.setItem('token', res.jwtToken);
        this.router.navigate(['/dashboard']);
      }, error => {
        console.log(error)
      });
  }
}
