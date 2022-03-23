import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';
import { Hospital } from '../../../models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm:FormGroup;
  public hospitales: Hospital[]=[];

  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  public imagenSubir: File;
  public imgTemp: any = null;
  public file :File;
  public imgSelect : String | ArrayBuffer;


  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fileUploadService: FileUploadService,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({id}) => this.cargarMedico(id));

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    })

    this.loadHospitales();

    this.medicoForm.get('hospital').valueChanges
      .subscribe( hospitalId =>{
          this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId);
        }
      )


  }

  cargarMedico(id: string){

    if(id === 'nuevo'){
      return;
    }

    this.medicoService.getMedicoById(id)
    .pipe(
      delay(100)
    )
    .subscribe( medico =>{

      if(!medico){
        return this.router.navigateByUrl(`/dasboard/medicos`);
      }

        const { nombre, hospital:{ _id } } = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({nombre, hospital: _id});

      });
  }

  loadHospitales(){
    this.hospitalService.cargarHospitales()
    .subscribe((hospitales: Hospital[])=>{
      this.hospitales = hospitales;
    })
  }

  guardarMedico(){

    const {nombre } = this.medicoForm.value;

    if(this.medicoSeleccionado){
      //actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data).subscribe(
        resp =>{
          Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
        });

    }else{
      //crear
      this.medicoService.crearMedico(this.medicoForm.value)
      .subscribe( (resp: any) =>{
        Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
        this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
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
    .actualizarFoto(this.imagenSubir, 'hospitales', this.hospitalSeleccionado._id)
    .then(img => { this.hospitalSeleccionado.img = img;
      Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

    }).catch(err =>{
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');

    })
  }

}
