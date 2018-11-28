import { Component, OnInit } from '@angular/core';
import { AdalService } from 'adal-angular4';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'christmas-tree-angular-demo';
  form: FormGroup;
  users: any;
  novosFeedbacks: any;
  todosFeedbacks: any;

  constructor(private adalService: AdalService, private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.adalService.init(environment.config);
    this.adalService.handleWindowCallback();
    this.login();
    this.initForm();
    this.usuarioControl.valueChanges.subscribe(value => this.buscarUsuarios(value));
  }

  private initForm() {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      mensagem: ['', Validators.required]
    });
  }

  private buscarUsuarios(value) {
    this.users = [];
    if (value && value.length > 3) {
      this.http.get(`/api/users/by-name?name=${value}`).subscribe(users => this.users = users)
    }
  }

  login() {
    if (!this.adalService.userInfo.authenticated) {
      this.adalService.login();
    }
  }

  enviar() {
    if (this.form.valid) {
      this.http.post(`/api/messages`, {
        emailTo: this.usuarioControl.value,
        text: this.mensagemControl.value
      })
        .subscribe(() => this.form.reset(), error => this.mensagemControl.setValue(error.message));
    }
  }

  onSelectUser(user) {
    this.usuarioControl.setValue(user.mail);
    this.users = [];
  }

  buscarNovosFeedbacks() {
    this.http.get('/api/messages/unread/me').subscribe(feedbacks =>  this.novosFeedbacks = feedbacks);
  }

  buscarTodosFeedbacks() {
    this.http.get('/api/messages/all/me').subscribe((feedbacks: any) =>  this.todosFeedbacks = feedbacks.content);
  }

  get usuarioControl() {
    return this.form.get('usuario');
  }

  get mensagemControl() {
    return this.form.get('mensagem');
  }
}
