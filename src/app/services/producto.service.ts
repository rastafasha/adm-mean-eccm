import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Producto } from '../models/producto.model';
import { Observable } from "rxjs";

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductoService {


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


  cargarProductos(){

    const url = `${base_url}/productos`;
    return this.http.get(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, productos: Producto[]}) => resp.productos)
      )

  }


  getProductoById(_id: string){
    const url = `${base_url}/productos/${_id}`;
    return this.http.get(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, producto: Producto}) => resp.producto)
        );

  }


  crearProducto(producto: {
    titulo: string,
    precio_antes: string,
    info_short: string,
    detalle: string,
    stock: string,
    categoria: string,
    subcategoria: string,
    nombre_selector: string,
    marca: string,
    video_review: string,
    precio_ahora: string,
  }){
    const url = `${base_url}/productos`;
    return this.http.post(url, producto, this.headers);
  }

  actualizarProducto(producto: Producto){
    const url = `${base_url}/productos/${producto._id}`;
    return this.http.put(url, producto, this.headers);
  }

  borrarProducto(_id:string){
    const url = `${base_url}/productos/${_id}`;
    return this.http.delete(url, this.headers);
  }

  best_seller():Observable<any>{
    const url = `${base_url}/productos/productos_ventas/best_sellers`;
    return this.http.get(url, this.headers);
  }

  populares():Observable<any>{
    const url = `${base_url}/productos_ventas/populares`;
    return this.http.get(url, this.headers);
  }

  listar_admin(filtro):Observable<any>{
    const url = `${base_url}/productos/admin/`+filtro;
    return this.http.get(url,  this.headers);
  }

  listar_prices(filtro,min,max,subcategoria,cat,sort,marca):Observable<any>{
    const url = `${base_url}/productos/`+filtro+'/'+min+'/'+max+'/'+subcategoria+'/'+cat+'/'+sort+'/'+marca;
    return this.http.get(url,  this.headers);
  }

  cat_by_name(nombre):Observable<any>{
    const url = `${base_url}/productos/categoria/name/`+nombre;
    return this.http.get(url,  this.headers);
  }

  listar_papelera(filtro):Observable<any>{
    const url = `${base_url}/productos/papelera/`+filtro;
    return this.http.get(url,  this.headers);
  }

  listar_cat(filtro):Observable<any>{
    const url = `${base_url}/productos/producto_admin_cat/cat/`+filtro;
    return this.http.get(url,  this.headers);
  }

  listar_autocomplete():Observable<any>{
    const url = `${base_url}/productos/producto_cliente_autocomplete`;
    return this.http.get(url,  this.headers);
  }

  listar_general_data(filtro):Observable<any>{
    const url = `${base_url}/productos/producto_general/general/data/`+filtro;
    return this.http.get(url,  this.headers);
  }

  find_by_slug(slug):Observable<any>{
    const url = `${base_url}/productos/producto_by_slug/slug/`+slug;
    return this.http.get(url,  this.headers);
  }

  listar_cat_papelera(filtro):Observable<any>{
    const url = `${base_url}/productos/productos/cat/papelera/`+filtro;
    return this.http.get(url,  this.headers);
  }

  list_one(id):Observable<any>{
    const url = `${base_url}/productos/producto_admin_editar/one/`+id;
    return this.http.get(url,  this.headers);
  }

  listar_newest():Observable<any>{
    const url = `${base_url}/productos/productos_nuevos/show_producto`;
    return this.http.get(url,  this.headers);
  }

  reducir_stock(id,cantidad):Observable<any>{
    const url = `${base_url}/productos/productos_stock/reducir/`+id+'/'+cantidad;
    return this.http.get(url,  this.headers);
  }

  aumentar_stock(id,cantidad):Observable<any>{
    const url = `${base_url}/productos/productos_stock/aumentar/`+id+'/'+cantidad;
    return this.http.get(url,  this.headers);
  }

  desactivar(id):Observable<any>{
    const url = `${base_url}/productos/producto_admin/admin/desactivar/`+id;
    return this.http.get(url,  this.headers);
  }

  activar(id):Observable<any>{
    const url = `${base_url}/productos/producto_admin/admin/activar/`+id;
    return this.http.get(url,  this.headers);
  }

  papelera(id):Observable<any>{
    const url = `${base_url}/productos/producto_admin/admin/papelera/`+id;
    return this.http.get(url,  this.headers);
  }

  aumentar_ventas(id):Observable<any>{
    const url = `${base_url}/productos/productos_ventas/aumentar/`+id;
    return this.http.get(url,  this.headers);
  }




}
