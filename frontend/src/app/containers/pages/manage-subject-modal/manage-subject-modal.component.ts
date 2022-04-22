import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UsuarioService } from 'src/app/data/usuario.service';
import { AsignaturaService } from 'src/app/data/asignatura.service';
import { Usuario } from '../../../models/usuario.model';
import { Asignatura } from '../../../models/asignatura.model';
import { FormBuilder, Validators } from '@angular/forms';
import { DataListComponent } from 'src/app/views/app/subjects/data-list/data-list.component';
import { AuthService } from 'src/app/shared/auth.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-manage-subject-modal',
  templateUrl: './manage-subject-modal.component.html',
  styleUrls: ['./manage-subject-modal.component.scss']
})
export class ManageSubjectModalComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  data: Usuario[] = [];
  profesoresNoAsignados: Usuario[] = [];
  profesoresAsignados: Usuario[] = [];
  alumnosAsignados: Usuario[] = [];
  alumnosNoAsignados: Usuario[] = [];
  asignatura: Asignatura;
  userRole: number;
  val: string;

  public formData=this.fb.group({
    nombre: ['', [Validators.required]],
    nombrecorto: ['', [Validators.required]],
    codigo: ['', [Validators.required]],
    curso: ['', [Validators.required]],
    profesores: [''],
    alumnos: ['']
  });


  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private asignaturaService: AsignaturaService, private usuarioService: UsuarioService, private fb: FormBuilder,
    private dataList: DataListComponent, private auth: AuthService, private notifications: NotificationsService) { }

  ngOnInit(): void {
    this.userRole = this.auth.rol;
  }

  show(id: number): void {

    this.asignatura = undefined;
    this.profesoresAsignados = [];
    this.profesoresNoAsignados = [];
    this.alumnosAsignados = [];
    this.alumnosNoAsignados = [];
    this.data = [];
    this.getSubject(id);
    
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  getSubject(id: number): void {
    this.asignaturaService.getSubject(id).subscribe(
      data => {
          this.asignatura = data['asignaturas'];
          this.profesoresAsignados = data['profesoresAsignados'];
          this.profesoresNoAsignados = data['profesoresNoAsignados'];
          this.alumnosAsignados = data['alumnosAsignados'];
          this.alumnosNoAsignados = data['alumnosNoAsignados'];
          console.log(this.asignatura);
      },
      error => {
        this.notifications.create('Error', 'No se ha podido obtener la Asignatura', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  closeModal(): void {
    this.dataList.loadSubjects(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear, this.dataList.userId);
    this.modalRef.hide();
  }

  manage(u: Usuario, accion: string): void {

    this.asignaturaService.updateSubject(this.asignatura, this.asignatura.uid, u.rol, u.uid, accion).subscribe( res => {      
      this.getSubject(this.asignatura.uid);

    }, (err) => {
      this.notifications.create('Error', 'No se ha podido actualizar la Asignatura', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 6000,
        showProgressBar: false
      });

      return;
    });

  }

  buscarUsuarios(val: string, rol: string): void {
    
    var usuarios = [];
    if(rol == 'ROL_PROFESOR') {
      usuarios = this.profesoresAsignados;
    } else {
      usuarios = this.alumnosAsignados;
    }

    if(val == '') {
      this.getSubject(this.asignatura.uid);
    } else {
      this.usuarioService.getUsers(undefined, undefined, rol, val, usuarios).subscribe( res => {
        if(res['ok']) {

          if(rol == 'ROL_PROFESOR') {
            this.profesoresAsignados = res['usuariosAsignados'] || [];
            this.profesoresNoAsignados = res['usuariosNoAsignados'] || [];
          } else {
            this.alumnosAsignados = res['usuariosAsignados'] || [];
            this.alumnosNoAsignados = res['usuariosNoAsignados'] || [];
          }
        
        }
      }, (err) => {
        this.notifications.create('Error', 'No se han podido filtrar los Usuarios', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });
  
        return;
      });
    }
  }

}
