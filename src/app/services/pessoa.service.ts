import { Injectable } from "@angular/core";
import { DatabaseService } from "./database.service";
import { Pessoa } from "../models/pessoa.model";

const PESSOAS_KEY = 'pessoas';

@Injectable(
     { providedIn: 'root' }
)
export class PessoaService{
    constructor(private databaseService: DatabaseService) {}
    async criar(pessoa: Pessoa) {
        const pessoas = await this.listar();
        if(pessoas) {
            pessoas.push(pessoa);
            this.databaseService.set(PESSOAS_KEY, pessoas);
        } else {
            this.databaseService.set(PESSOAS_KEY, [pessoa]);
        }
    }

    listar(): Promise<Pessoa[] | null> {
        return this.databaseService.get<Pessoa[]>(PESSOAS_KEY);
    }

    async editar(pessoa: Pessoa, email: string) {
        const pessoas = await this.listar();
        if(pessoas) {
            const index = pessoas.findIndex(p => p.email === email);
            if(index !== -1) {
                console.log('index', index);
                pessoas.splice(index, 1, pessoa);
                this.databaseService.set(PESSOAS_KEY, pessoas);
            }else {
                this.databaseService.set(PESSOAS_KEY, [pessoa]);
            }
        }
    }

    async get(email: string): Promise<Pessoa | null> {
        const pessoas = await this.listar();
        if(pessoas) {
            const index = pessoas.findIndex(p => p.email === email);
            if(index !== -1) {
                return pessoas[index];
            }
            return null;
        }
        return null;
    }

    async findByNome(nome: string): Promise<Pessoa[] | null> {
        const pessoas = await this.listar();
        if(pessoas) {
            return pessoas.filter(p => p.nome.includes(nome));
        }
        return null;
    }

    async delete(email: string): Promise<boolean>{
        const pessoas = await this.listar();
        if(pessoas) {
            const index = pessoas.findIndex(p => p.email === email);
            if(index !== -1) {
                pessoas.splice(index, 1);
                this.databaseService.set(PESSOAS_KEY, pessoas);
                return true;
            }
        }
        return false;
    }

}