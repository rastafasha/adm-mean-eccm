import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { BusquedasService } from '../../../services/busquedas.service';
import { Hospital } from '../../../models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] =[];
  public cargando: boolean = true;

  public imgSubs: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService,
  ) { }

  ngOnInit(): void {

    this.loadHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => { this.loadHospitales();});

  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  loadHospitales(){
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe(
      hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
      }
    )
  }



  eliminarHospital(hospital: Hospital){
    this.hospitalService.borrarHospital(hospital._id)
    .subscribe( resp => {
      this.loadHospitales();
      Swal.fire('Borrado', hospital.nombre, 'success')
    })

  }

  guardarCambios(hospital: Hospital){
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
    .subscribe( resp => {
      Swal.fire('Actualizado', hospital.nombre, 'success')
    })

  }

  async abrirSweetAlert(){
    const {value = '' } = await Swal.fire<string>({
      title:'Agregar Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton: true,
    })
    if(value.trim().length > 0){
      this.hospitalService.crearHospital(value)
      .subscribe((resp: any) => {
        this.hospitales.push(resp.hospital)
      })
    }
  }

  abrirModal(hospital: Hospital){
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img );
  }


  buscar(termino: string){

    if(termino.length === 0){
      return this.loadHospitales();
    }

    this.busquedaService.buscar('hospitales', termino)
    .subscribe( resultados => {
      // this.hospitales = resultados;
    })
  }

}
