import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { ContactoService } from 'src/app/services/contact.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public usuario: Usuario;
  public mensajes : Array<any> = [];
  public page;
  public pageSize = 15;
  public count_cat;


  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private _contactoService :ContactoService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this._contactoService.listar().subscribe(
      response=>{
        this.mensajes = response.data;
        this.count_cat = this.mensajes.length;
        this.page = 1;
      },
      error=>{

      }
    );
  }

  logout(){
    this.usuarioService.logout();
  }


  buscar(termino: string){

    if(termino.length === 0){
      return;
    }

    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);

  }

}
