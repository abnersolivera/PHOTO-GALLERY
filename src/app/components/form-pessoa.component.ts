import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {  
  IonToolbar,   
  IonLabel, 
} from '@ionic/angular/standalone';
import { PessoaService } from '../services/pessoa.service';

@Component({
  selector: 'app-form-pessoa',
  templateUrl: 'form-pessoa.component.html',
  standalone: true,
  imports: [            
    IonLabel,   
    IonToolbar,
    ReactiveFormsModule,
    CommonModule,
    IonicModule,
  ],
})
export class FormPessoaComponent {
  @Input()
  modal = false;

  formGroup: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    telefone: [''],
    email: ['', Validators.email],
    hobbie: [''],
  });

  emailToEdit: string | null = null;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private pessoaService: PessoaService,
    private modalController: ModalController
  ) {}

  async salvar() {
    if (this.formGroup.valid) {
      if (this.emailToEdit) {
        await this.pessoaService.editar(this.formGroup.value, this.emailToEdit);
      } else {
        this.pessoaService.criar(this.formGroup.value);
      }
      const alert = await this.alertController.create({
        header: 'Sucesso',
        message: 'Pessoa salva com sucesso',
        buttons: ['OK'],
      });
      alert.onDidDismiss().then((_) => {
        this.close();
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Preencha todos os campos obrigatórios',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }  

  close() {
    this.modalController.dismiss(true, 'close');
  }
}
