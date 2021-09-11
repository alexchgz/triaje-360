import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UsuarioService } from 'src/app/data/usuario.service';
import { AsignaturaService } from 'src/app/data/asignatura.service';
import { Usuario } from '../../../models/usuario.model';
import { Asignatura } from '../../../models/asignatura.model';

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
  profesoresNoAsignados: Usuario[] = [];
  profesoresAsignados: Usuario[] = [];
  alumnos: Usuario[] = [];
  alumnosAgregados: Usuario[] = [];
  asignatura: Asignatura;
  isLoading: boolean;
  endOfTheList = false;


  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private asignaturaService: AsignaturaService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
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
          // console.log(this.asignatura.profesores[0]);
          for(let i = 0; i < this.asignatura.profesores.length; i++) {
            this.idTeachers.push(this.asignatura.profesores[i].usuario._id);
          }
          console.log(this.idTeachers);
          this.getTeachers();
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

  getTeachers(): void {
    this.usuarioService.getTeachers(this.idTeachers).subscribe(
      data => {
        if (data['ok']) {
          console.log(data['profesores']);
          this.isLoading = false;
          this.profesoresAsignados = data['profesoresAsignados'].map(x => {
            return {
              ...x,
              // img: x.img.replace('/img/', '/img/products/')
            };
          });
          this.profesoresNoAsignados = data['profesoresNoAsignados'].map(x => {
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

  // sortRoles(): void {
  //   for(let i=0; i<this.data.length; i++) {
  //     for(let j=0; j<this.asignatura.profesores.length; j++){
  //       if(this.data[i].rol == 'ROL_PROFESOR' && this.data[i].uid != this.asignatura.profesores[j]._id) {
  //         this.profesores.push(this.data[i]);
  //       }
  //       else {
  //         this.profesoresAgregados.push(this.data[i]);
  //       }
  //     }
  //   }

  //   // console.log(this.asignatura.profesores[0]['usuario']._id);
  //   console.log(this.asignatura.profesores[0].usuario._id);

  // }

  closeModal(): void {
    // console.log('entro aqui');
    this.modalRef.hide();
    this.asignatura = undefined;
    this.profesoresAsignados = [];
    this.profesoresNoAsignados = [];
    this.alumnos = [];
    this.data = [];
  }

}
