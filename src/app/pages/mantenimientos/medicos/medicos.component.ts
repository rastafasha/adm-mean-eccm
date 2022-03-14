import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { BusquedasService } from '../../../services/busquedas.service';
import { Medico } from '../../../models/medico.model';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] =[];
  public cargando: boolean = true;

  public imgSubs: Subscription;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService,
  ) { }

  ngOnInit(): void {

    this.loadMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => { this.loadMedicos();});

  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  loadMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe(
      medicos => {
        this.cargando = false;
        this.medicos = medicos;
      }
    )
  }

  guardarCambios(medico: Medico){
    this.medicoService.actualizarMedico(medico)
    .subscribe( resp => {
      Swal.fire('Actualizado', medico.nombre, 'success')
    })

  }

  eliminarMedico(medico: Medico){
    this.medicoService.borrarMedico(medico._id)
    .subscribe( resp => {
      this.loadMedicos();
      Swal.fire('Borrado', medico.nombre, 'success')
    })

  }



  abrirModal(medico: Medico){
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img );
  }


  buscar(termino: string){

    if(termino.length === 0){
      return this.loadMedicos();
    }

    this.busquedaService.buscar('medicos', termino)
    .subscribe( resultados => {
      // this.medicos = resultados;
    })
  }

}
