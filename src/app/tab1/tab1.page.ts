import { Component, ViewChild } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonAlert,
  IonInput,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormPessoaComponent } from '../components/form-pessoa.component';
import { ViewDidEnter, IonicModule } from '@ionic/angular';
import { PessoaService } from '../services/pessoa.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonAlert,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormPessoaComponent,
  ],
})
export class Tab1Page implements ViewDidEnter {
  @ViewChild(FormPessoaComponent)
  formPessoa!: FormPessoaComponent;

  constructor(
    private pessoaService: PessoaService,
    private activeRouter: ActivatedRoute
  ) {}

  ionViewDidEnter(): void {
    this.formPessoa.emailToEdit = null;
    const email = this.activeRouter.snapshot.paramMap.get('email');
    console.log(email);
    if(email){
      console.log(email);
      this.pessoaService.get(email).then((pessoa) => {
        if(pessoa){
          this.formPessoa.formGroup.patchValue(pessoa);
          this.formPessoa.emailToEdit = email;
        }
      });
    }
  }
}
