import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { GaleriaService } from 'src/app/services/galeria.service';
import {environment} from 'src/environments/environment';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../services/usuario.service';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-galeria-producto',
  templateUrl: './galeria-producto.component.html',
  styleUrls: ['./galeria-producto.component.css']
})
export class GaleriaProductoComponent implements OnInit {

  public id;
  public imagenes : any = [];
  public files: File[] = [];
  public msm_error=false;
  public url;
  public count_img;
  public identity;

  public imgSelect : String | ArrayBuffer;
  public productoSeleccionado: Producto;
  public imagenSubir: File;


  p: number = 1;
  count: number = 8;

  constructor(
    private _galeriaService : GaleriaService,
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService: UsuarioService,
    private fileUploadService: FileUploadService,

  ) {
    this.url = environment.baseUrl;
    this.identity = this._userService.usuario;
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this._galeriaService.get_cupon(this.id).subscribe(
          response=>{
            this.imagenes = response.imagenes;
            this.count_img = this.imagenes.length;
          },
          error=>{

          }
        )
      }
    );

  }

  close_toast(){
    /* $('#dark-toast').removeClass('show');
        $('#dark-toast').addClass('hide'); */
  }

  close_modal(){
    $('#addimg').modal('hide');
    this.files = [];
  }

  close_alert(){
    this.msm_error = false;
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
    console.log(this.files);

  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onSubmit(galeriaForm){

      let data = {
        imagenes : this.files,
        producto : this.id
      }

      this._galeriaService.registro(data).subscribe(
        response =>{
          this.close_modal();
          this.listar();


        },
        error=>{
          this.msm_error = true;
        }
      );
  }


  listar(){
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this._galeriaService.get_cupon(this.id).subscribe(
          response=>{
            this.imagenes = response.imagenes;
            this.count_img = this.imagenes.length;
          },
          error=>{

          }
        )
      }
    );
  }


  eliminar(id){
    this._galeriaService.eliminar(id).subscribe(
      response=>{

        $('#modal-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.listar();

      },
      error=>{

      }
    );
  }

  subirImagen(){
    this.fileUploadService
    .actualizarFoto(this.imagenSubir, 'galerias', this.productoSeleccionado._id)
    .then(img => { this.productoSeleccionado.img = img;
      Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

    }).catch(err =>{
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');

    })
  }

}
