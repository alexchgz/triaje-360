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

const mongoose = require('mongoose');
const bson = require('bson');

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
  idTeachers: number[] = [];
  idStudents: number[] = [];
  profesoresNoAsignados: Usuario[] = [];
  profesoresAsignados: Usuario[] = [];
  idsProfesoresAsignados: number[] = [];
  alumnosAsignados: Usuario[] = [];
  alumnosNoAsignados: Usuario[] = [];
  idsAlumnosAsignados: number[] = [];
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

  constructor(private modalService: BsModalService, private asignaturaService: AsignaturaService, private usuarioService: UsuarioService, private fb: FormBuilder, private dataList: DataListComponent) { }

  ngOnInit(): void {
    this.userRole = getUserRole();
  }

  show(id: number): void {
    this.getSubject(id);
    // this.getUsers();
    // this.getTeachers();
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  getSubject(id: number): void {
    this.asignaturaService.getSubject(id).subscribe(
      data => {
        if (data['ok']) {
          // console.log(data['asignaturas']);
          this.asignatura = data['asignaturas'];
          // console.log(this.asignatura);

          if(this.asignatura.profesores.length > 0) {
            for(let i = 0; i < this.asignatura.profesores.length; i++) {
              this.idTeachers.push(this.asignatura.profesores[i].usuario._id);
            }
          }

          if(this.asignatura.alumnos.length > 0) {
            for(let j = 0; j < this.asignatura.alumnos.length; j++) {
              this.idStudents.push(this.asignatura.alumnos[j].usuario._id);
            }
          }

          // console.log(this.idTeachers);
          // console.log(this.idStudents);
          this.getTeachers();
          this.getStudents();

        } else {
          this.endOfTheList = true;
        }
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  getUsers(): void {
    this.usuarioService.getUsers().subscribe(
      data => {
        if (data['ok']) {
          console.log(data['usuarios']);
          this.isLoading = false;
          this.data = data['usuarios'].map(x => {
            return {
              ...x,
              // img: x.img.replace('/img/', '/img/products/')
            };
          });
          // this.sortRoles();
        } else {
          this.endOfTheList = true;
        }
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  getTeachers(search?: string): void {
    // console.log(this.idTeachers);
    this.usuarioService.getTeachers(this.idTeachers, search).subscribe(
      data => {
        if (data['ok']) {
          // console.log(data['profesoresAsignados']);
          // console.log(data['profesoresNoAsignados']);
          this.isLoading = false;
          this.profesoresAsignados = data['profesoresAsignados'];
          // por si no hay profesores asignados
          if(!this.profesoresAsignados) {
            this.profesoresAsignados = [];
          }
          this.profesoresNoAsignados = data['profesoresNoAsignados'];
          // por si están todos asignados
          if(!this.profesoresNoAsignados) {
            this.profesoresNoAsignados = [];
          }
          // this.sortRoles();
        } else {
          this.endOfTheList = true;
        }
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  getStudents(search?: string): void {
    this.usuarioService.getStudents(this.idStudents, search).subscribe(
      data => {
        if (data['ok']) {
          // console.log(data['alumnosNoAsignados']);
          this.isLoading = false;
          this.alumnosAsignados = data['alumnosAsignados'];
          this.alumnosNoAsignados = data['alumnosNoAsignados'];
          // this.sortRoles();
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
    // console.log('entro aqui');

    // actualizamos la asignatura con las nuevas listas
    console.log(getUserRole());
    if(getUserRole() == 0) {
      this.asignaturaService.updateSubject(this.asignatura, this.asignatura.uid).subscribe( res => {
        console.log('Asignatura actualizada');
        this.dataList.loadSubjects(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear, this.dataList.userId);
        // mensaje modal
      }, (err) => {
        return;
      });
    }

    this.modalRef.hide();
    this.asignatura = undefined;
    this.profesoresAsignados = [];
    this.profesoresNoAsignados = [];
    this.alumnosAsignados = [];
    this.alumnosNoAsignados = [];
    this.idTeachers = [];
    this.idStudents = [];
    this.data = [];

  }

  assign(u: Usuario): void {
    // comprobamos el rol
    if(u.rol == 'ROL_PROFESOR') {
      // eliminamos el elemento
      var indice = this.profesoresNoAsignados.indexOf(u); // obtenemos el indice
      this.profesoresNoAsignados.splice(indice, 1); // 1 es la cantidad de elemento a eliminar

      // lo añadimos al otro array
      this.profesoresAsignados.push(u);

      console.log(this.asignatura);

      // generamos id para el profesor
      // var idP = new bson.ObjectId().toString();
      var idP = new bson.ObjectId().toString();
      console.log(idP);
      console.log(u.uid);

      this.asignatura.profesores.push({ '_id': idP, 'usuario': u });


    } else if(u.rol == 'ROL_ALUMNO') {
      // eliminamos el elemento
      var indice = this.alumnosNoAsignados.indexOf(u); // obtenemos el indice
      this.alumnosNoAsignados.splice(indice, 1); // 1 es la cantidad de elemento a eliminar

      // lo añadimos al otro array
      this.alumnosAsignados.push(u);

      // generamos id para el profesor
      // var idP = new bson.ObjectId().toString();
      var idP = new bson.ObjectId().toString();
      console.log(idP);
      console.log(u.uid);

      this.asignatura.alumnos.push({ '_id': idP, 'usuario': u });

    }

    console.log( this.asignatura );
    // console.log( nueva );

  }

  disassign(u: Usuario): void {

    // comprobamos el rol
    if(u.rol == 'ROL_PROFESOR') {
      // eliminamos el elemento
      var indice = this.profesoresAsignados.indexOf(u); // obtenemos el indice
      this.profesoresAsignados.splice(indice, 1); // 1 es la cantidad de elemento a eliminar

      // lo añadimos al otro array
      this.profesoresNoAsignados.push(u);

      // buscamos cual es y lo eliminamos en el array bueno
      for(let i=0; i<this.asignatura.profesores.length; i++) {
        if(this.asignatura.profesores[i].usuario._id == u.uid) {
          this.asignatura.profesores.splice(i, 1);
          console.log('asdas');
        }
      }

    } else if(u.rol == 'ROL_ALUMNO') {
      // eliminamos el elemento
      var indice = this.alumnosAsignados.indexOf(u); // obtenemos el indice
      this.alumnosAsignados.splice(indice, 1); // 1 es la cantidad de elemento a eliminar

      // lo añadimos al otro array
      this.alumnosNoAsignados.push(u);

      // buscamos cual es y lo eliminamos en el array bueno
      for(let i=0; i<this.asignatura.alumnos.length; i++) {
        if(this.asignatura.alumnos[i].usuario._id == u.uid) {
          this.asignatura.alumnos.splice(i, 1);
          console.log('asdas');
        }
      }
    }

    console.log( this.asignatura );
    // console.log( nueva );


    // actualizamos la asignatura con las nuevas listas
    // this.asignaturaService.updateSubject(this.asignatura, this.asignatura.uid).subscribe( res => {
    //   console.log('Asignatura actualizada');
    //   // mensaje modal
    // }, (err) => {
    //   return;
    // });

  }

  assignIds(): void {
    for(let i = 0; i < this.profesoresAsignados.length; i++) {
      this.idsProfesoresAsignados[i] = this.profesoresAsignados[i].uid;
    }
    for(let j = 0; j < this.alumnosAsignados.length; j++) {
      this.idsAlumnosAsignados[j] = this.alumnosAsignados[j].uid;
    }
  }

  buscarProfes(val: string): void {
    // val = event.target.value.toLowerCase().trim();
    // console.log(val);
    this.getTeachers(val);
        // this.loadData(this.itemsPerPage, 1, val, this.orderBy);
  }

  buscarAlumnos(val: string): void {
    // val = event.target.value.toLowerCase().trim();
    // console.log(val);
    this.getStudents(val);
        // this.loadData(this.itemsPerPage, 1, val, this.orderBy);
  }

}
