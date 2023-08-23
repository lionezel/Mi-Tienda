import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public register_user: any = {}

  register(registerForm: any) {
    if(registerForm.valid){
     
      let data = {
        names: this.register_user.names,
        last_name: this.register_user.last_name,
        email: this.register_user.email,
        password: this.register_user.password,
      }
    }

  }
}
