import { Component, OnInit, DoCheck } from '@angular/core';
import {environment} from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { Congeneral } from 'src/app/models/congeneral.model';
import { CongeneralService } from 'src/app/services/congeneral.service';

interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-config-site',
  templateUrl: './config-site.component.html',
  styleUrls: ['./config-site.component.css']
})
export class ConfigSiteComponent implements OnInit {



  public confGeneralForm: FormGroup;
  public congeneral: Congeneral;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  public imagenSubir1: File;
  public imgTemp1: any = null;

  public congeneralSeleccionado: Congeneral;

  constructor(
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    private congeneralService: CongeneralService,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
  ) {
    this.usuario = usuarioService.usuario;
    this.congeneral = congeneralService.congeneral;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {

    window.scrollTo(0,0);

    this.activatedRoute.params.subscribe( ({id}) => this.cargarConf(id));

    this.confGeneralForm = this.fb.group({
      titulo: ['', Validators.required],
      cr: ['', Validators.required],
      telefono_uno: ['', Validators.required],
      telefono_dos: ['', Validators.required],
      email_uno: ['', Validators.required],
      email_dos: ['', Validators.required],
      direccion: ['', Validators.required],
      horarios: ['', Validators.required],
      iframe_mapa: ['', Validators.required],
      facebook: ['', Validators.required],
      instagram: ['', Validators.required],
      youtube: ['', Validators.required],
      twitter: ['', Validators.required],
    });

    this.congeneralService.getCongeneralById(this.congeneral._id).subscribe(
      resp =>{
        this.congeneral = resp;
        console.log(this.congeneral)

      }
    )

  }


  cargarConf(_id: string){

    if(_id === 'nuevo'){
      return;
    }

    this.congeneralService.getCongeneralById(_id)
    .pipe(
      // delay(100)
      )
      .subscribe( congeneral =>{


      if(!congeneral){
        return this.router.navigateByUrl(`/dasboard/account-settings`);
      }

        const {
          titulo,
          cr,
          telefono_uno,
          telefono_dos,
          email_uno,
          email_dos,
          direccion,
          horarios,
          iframe_mapa,
          facebook,
          instagram,
          youtube,
          twitter
         } = congeneral;
        this.congeneralSeleccionado = congeneral;
        this.confGeneralForm.setValue({
          titulo,
          cr,
          telefono_uno,
          telefono_dos,
          email_uno,
          email_dos,
          direccion,
          horarios,
          iframe_mapa,
          facebook,
          instagram,
          youtube,
          twitter});

      });

      console.log(this.congeneral);

  }



  updateConfiguracion(){

    this.congeneralService.actualizarCongeneral(this.confGeneralForm.value)
    .subscribe(resp => {
      const {titulo, cr, telefono_uno,telefono_dos, email_uno,
        email_dos, direccion, horarios, iframe_mapa, facebook,
        instagram, youtube, twitter} = this.confGeneralForm.value;
      this.congeneral.titulo = titulo;
      this.congeneral.cr = cr;
      this.congeneral.telefono_uno = telefono_uno;
      this.congeneral.telefono_dos = telefono_dos;
      this.congeneral.email_uno = email_uno;
      this.congeneral.email_dos = email_dos;
      this.congeneral.direccion = direccion;
      this.congeneral.horarios = horarios;
      this.congeneral.iframe_mapa = iframe_mapa;
      this.congeneral.facebook = facebook;
      this.congeneral.instagram = instagram;
      this.congeneral.youtube = youtube;
      this.congeneral.twitter = twitter;
      Swal.fire('Guardado', 'Los cambios fueron actualizados', 'success');
    }, (err)=>{
      Swal.fire('Error', err.error.msg, 'error');

    })

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
    .actualizarFoto(this.imagenSubir, 'congenerals', this.congeneralSeleccionado._id)
    .then(img => {
      this.congeneralSeleccionado.logo = img;
      Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

    }).catch(err =>{
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');

    })

  }

  cambiarImagen1(file: File){
    this.imagenSubir1 = file;

    if(!file){
      return this.imgTemp1 = null;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () =>{
      this.imgTemp1 = reader.result;
    }
  }

  subirImagen1(){
    this.fileUploadService
    .actualizarFoto(this.imagenSubir1, 'congenerals', this.congeneralSeleccionado._id)
    .then(img => {
      this.congeneralSeleccionado.favicon = img;
      Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

    }).catch(err =>{
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');

    })

  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }



  init_data(){
    this.congeneralService.get_data().subscribe(
      response =>{
        this.congeneral = response.data;
        $('#content-mapa').html(this.congeneral.iframe_mapa);
      },
      error=>{

      }
    );
  }

  onkey_iframe(data){

    $('#content-mapa').html(data);
  }
}
