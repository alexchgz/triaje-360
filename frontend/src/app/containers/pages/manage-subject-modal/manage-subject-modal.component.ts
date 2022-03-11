import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UsuarioService } from 'src/app/data/usuario.service';
import { AsignaturaService } from 'src/app/data/asignatura.service';
import { Usuario } from '../../../models/usuario.model';
import { Asignatura } from '../../../models/asignatura.model';
import { FormBuilder, Validators } from '@angular/forms';
import { id } from '@swimlane/ngx-datatable';
import { DataListComponent } from 'src/app/views/app/subjects/data-list/data-list.component';
import { getUserRole } from 'src/app/utils/util';
import { AuthService } from 'src/app/shared/auth.service';

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
  categories = [
    { label: 'Cakes', value: 'chocolate' },
    { label: 'Cupcakes', value: 'vanilla' },
    { label: 'Desserts', value: 'strawberry' }
  ];
  data: Usuario[] = [];
  profesoresNoAsignados: Usuario[] = [];
  profesoresAsignados: Usuario[] = [];
  alumnosAsignados: Usuario[] = [];
  alumnosNoAsignados: Usuario[] = [];
  asignatura: Asignatura;
  isLoading: boolean;
  endOfTheList = false;
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
    private dataList: DataListComponent, private auth: AuthService) { }

  ngOnInit(): void {
    // this.userRole = getUserRole();
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
        if (data['ok']) {
          console.log(data);
          this.asignatura = data['asignaturas'];
          console.log(this.asignatura);

          this.profesoresAsignados = data['profesoresAsignados'];
          this.profesoresNoAsignados = data['profesoresNoAsignados'];
          this.alumnosAsignados = data['alumnosAsignados'];
          this.alumnosNoAsignados = data['alumnosNoAsignados'];

        } else {
          this.endOfTheList = true;
        }
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  closeModal(): void {
    this.dataList.loadSubjects(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear, this.dataList.userId);
    this.modalRef.hide();
  }

  manage(u: Usuario, accion: string): void {

    this.asignaturaService.updateSubject(this.asignatura, this.asignatura.uid, u.rol, u.uid, accion).subscribe( res => {
      console.log('Asignatura actualizada');
      // mensaje modal
      this.getSubject(this.asignatura.uid);
    }, (err) => {
      return;
    });

    console.log( this.asignatura );

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
        console.log('Alumnos traídos');
        if(res['ok']) {

          if(rol == 'ROL_PROFESOR') {
            this.profesoresAsignados = res['usuariosAsignados'];
            this.profesoresNoAsignados = res['usuariosNoAsignados'];
          } else {
            this.alumnosAsignados = res['usuariosAsignados'];
            this.alumnosNoAsignados = res['usuariosNoAsignados'];
          }
        
        }
      }, (err) => {
        return;
      });
    }
  }

}
