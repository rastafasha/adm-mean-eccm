import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';
import { Marca } from '../models/marca.model';
import { Producto } from '../models/producto.model';

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(
    private http: HttpClient
  ) { }

  get token():string{
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return{
      headers: {
        'x-token': this.token
      }
    }
  }

  private trasnformarUsuarios(resultados: any[]): Usuario[]{
    return resultados.map(
      user => new Usuario( user.first_name, user.last_name,user.telefono, user.pais, user.numdoc, user.email, '', user.img, user.google, user.role, user.uid)
    )
  }

  private trasnformarCategorias(resultados: any[]): Hospital[]{
    return resultados;
  }
  private trasnformarProductos(resultados: any[]): Producto[]{
    return resultados;
  }
  private trasnformarMarcas(resultados: any[]): Marca[]{
    return resultados;
  }
  private trasnformarMedicos(resultados: any[]): Medico[]{
    return resultados;
  }

  buscar(tipo: 'usuarios'|'medicos'|'categorias' |'marcas' |'hospitales' |'productos',
        termino: string
        ){
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map( (resp: any) => {
          switch(tipo) {
              case 'usuarios':
                return this.trasnformarUsuarios(resp.resultados)

              case 'categorias':
                return this.trasnformarCategorias(resp.resultados)
              case 'productos':
                return this.trasnformarProductos(resp.resultados)

              case 'marcas':
                return this.trasnformarMarcas(resp.resultados)

              case 'medicos':
                return this.trasnformarMedicos(resp.resultados)

              default:
                return[];
          }
        })
      )
  }


  searchGlobal(termino: string){
    const url = `${base_url}/todo/${termino}`;
    return this.http.get<any[]>(url, this.headers)
  }
}
