import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLoading,
  IonItem,
  IonSearchbar,
  IonButton,
  IonList,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Pessoa } from '../models/pessoa.model';
import { ViewDidEnter, ToastController, ModalController } from '@ionic/angular';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';
import { PessoaService } from '../services/pessoa.service';
import { FormPessoaComponent } from '../components/form-pessoa.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLoading,
    IonItem,
    IonSearchbar,
    IonButton,
    IonList,
    ExploreContainerComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class Tab2Page implements ViewDidEnter, OnInit, OnDestroy {
  pessoas: Pessoa[] | null = [];
  loading = false;
  filterForms = this.fb.group({
    nome: [''],
  });

  subscription: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private toastController: ToastController,
    private router: Router,
    private modalController: ModalController
  ) {}

  async ionViewDidEnter() {
    this.listar();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((s) => s.unsubscribe());
  }
  ngOnInit(): void {
    const sub = this.filterForms.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => this.filtrar(value.nome!));
    this.subscription.push(sub);
  }

  async listar() {
    const data = await this.pessoaService.listar();

    if (!data) {
      const toast = await this.toastController.create({
        message: 'Lista vazia',
        duration: 1500,
        position: 'top',
      });
      await toast.present();
    } else {
      this.pessoas = data;
    }
  }

  editar(pessoa: Pessoa) {
    this.router.navigate(['tabs/tab1', pessoa.email]);
  }

  async filtrar(nome: string) {
    const pessoas = await this.pessoaService.findByNome(nome);
    this.pessoas = pessoas;
  }

  async deletar(pessoa: Pessoa) {
    const deltado = await this.pessoaService.delete(pessoa.email);
    if (deltado) {
      this.listar();
      const toast = await this.toastController.create({
        message: 'Pessoa deletada com sucesso!',
        duration: 1500,
        position: 'top',
      });
      await toast.present();
    }
  }

  async criarNovo() {
    const modal = await this.modalController.create({
      component: FormPessoaComponent,
      componentProps: { modal: true },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'close') {
      this.listar();
    }
  }
}
