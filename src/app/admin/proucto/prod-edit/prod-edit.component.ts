import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { Producto } from 'src/app/models/producto.model';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MarcaService } from 'src/app/services/marca.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';


interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-prod-edit',
  templateUrl: './prod-edit.component.html',
  styleUrls: ['./prod-edit.component.css'],
  providers:[
    MarcaService,
    CategoriaService
  ]
})
export class ProdEditComponent implements OnInit {


  public productoForm: FormGroup;
  public producto: Producto;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  public file :File;
  public imgSelect : String | ArrayBuffer;
  public listMarcas;
  public listCategorias;

  banner: string;
  pageTitle: string;

  public productoSeleccionado: Producto;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private modalImagenService: ModalImagenService,
    private marcaService: MarcaService,
    private categoriaService: CategoriaService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({id}) => this.cargarProducto(id));

    window.scrollTo(0,0);
    this.getMarca();
    this.getCategorias();


    this.productoForm = this.fb.group({
      titulo: ['',Validators.required],
      precio_antes: ['',Validators.required],
      info_short: ['',Validators.required],
      detalle: ['',Validators.required],
      stock: ['',Validators.required],
      categoria: ['',Validators.required],
      subcategoria: ['',Validators.required],
      nombre_selector: ['',Validators.required],
      marca: ['',Validators.required],
      video_review: ['',Validators.required],
      precio_ahora: ['',Validators.required],
    })

    if(this.productoSeleccionado){
      //actualizar
      this.pageTitle = 'Create Producto';

    }else{
      //crear
      this.pageTitle = 'Edit Producto';
    }



  }


  getMarca(){
    this.marcaService.cargarMarcas().subscribe(
      resp =>{
        this.listMarcas = resp;
        console.log(this.listMarcas)

      }
    )
  }
  getCategorias(){
    this.categoriaService.cargarCategorias().subscribe(
      resp =>{
        this.listCategorias = resp;
        console.log(this.listCategorias)

      }
    )
  }

  cargarProducto(_id: string){

    if(_id === 'nuevo'){
      return;
    }

    this.productoService.getProductoById(_id)
    .pipe(
      // delay(100)
      )
      .subscribe( producto =>{


      if(!producto){
        return this.router.navigateByUrl(`/dasboard/producto`);
      }

        const { titulo, precio_antes,info_short,detalle, stock,categoria,subcategoria,
          nombre_selector,marca,video_review,precio_ahora, } = producto;
        this.productoSeleccionado = producto;
        this.productoForm.setValue({
          titulo, precio_antes,info_short,detalle, stock,categoria,subcategoria,
          nombre_selector,marca,video_review,precio_ahora,
        });

      });

  }





  updateProducto(){

    const {titulo, precio_antes,info_short,detalle, stock,categoria,subcategoria,
      nombre_selector,marca,video_review,precio_ahora, } = this.productoForm.value;

    if(this.productoSeleccionado){
      //actualizar
      const data = {
        ...this.productoForm.value,
        _id: this.productoSeleccionado._id
      }
      this.productoService.actualizarProducto(this.producto._id, this.producto).subscribe(
        resp =>{
          Swal.fire('Actualizado', `${titulo}  actualizado correctamente`, 'success');
        });

    }else{
      //crear
      this.productoService.crearProducto(this.productoForm.value)
      .subscribe( (resp: any) =>{
        Swal.fire('Creado', `${titulo} creado correctamente`, 'success');
        // this.router.navigateByUrl(`/dashboard/marca/${resp.marca._id}`)
      })
    }

  }


  cambiarImagen(file: File){
    this.imagenSubir = file;

    if(!file){
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () =>{
      this.imgTemp = reader.result;
    }
  }

  subirImagen(){
    this.fileUploadService
    .actualizarFoto(this.imagenSubir, 'productos', this.productoSeleccionado._id)
    .then(img => { this.productoSeleccionado.img = img;
      Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

    }).catch(err =>{
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');

    })
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }


}
