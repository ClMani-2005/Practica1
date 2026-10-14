import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonInput,IonSelect,IonSelectOption,IonButton,IonList } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gestion-alumnos',
  templateUrl: './gestion-alumnos.page.html',
  standalone: true,
  styleUrls: ['./gestion-alumnos.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonItem,IonInput,IonSelect,IonSelectOption,IonButton,IonList]
})
export class GestionAlumnosPage implements OnInit {
  alumnos: any = this.alumnoVacio();

  // Se llena desde la base de datos para que los id coincidan con la tabla carreras
  listaCarreras: { id: number, nombre: string }[] = [];

  constructor(private http: HttpClient, private AlertControlller: AlertController) { }

  ngOnInit() {
    this.cargarCarreras();
  }

  alumnoVacio() {
    return {
      n_control: "",
      nombre: "",
      s_nombre: "",
      apat: "",
      amat: "",
      fecha: "",
      genero: "",
      fk_caralu: null
    };
  }

  cargarCarreras() {
    this.http.get<any[]>('http://localhost/api_ionic/carreras.php').subscribe({
      next: (carreras) => {
        this.listaCarreras = carreras;
      },
      error: (error) => {
        console.error('No se pudieron cargar las carreras', error);
        this.mostrarAlerta('Error', 'No se pudieron cargar las carreras.');
      }
    });
  }

  calcularEdad(fecha: string): number {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const hoy = new Date();
  let edad = hoy.getFullYear() - anio;
  const yaCumplio =
    (hoy.getMonth() + 1 > mes) ||
    (hoy.getMonth() + 1 === mes && hoy.getDate() >= dia);
  if (!yaCumplio) {
    edad--;
  }
  return edad;
  }

  async mostrarAlerta(mensaje: string, titulo: string = 'Atencion') {
    const alert = await this.AlertControlller.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  validarGuardar() {
    const a = this.alumnos;

    if (!a.n_control.trim()) {
      this.mostrarAlerta('El número de control no puede estar vacio');
      return;
    }
    if (a.n_control.trim().length > 10) {
      this.mostrarAlerta('El número de control no puede pasar de 10 caracteres');
      return;
    }
    if (!a.nombre.trim()) {
      this.mostrarAlerta('El nombre no puede estar vacio');
      return;
    }
    if (!a.apat.trim() || !a.amat.trim()) {
      this.mostrarAlerta('Los apellidos no pueden estar vacios');
      return;
    }
    if (!a.fecha) {
          const edad = this.calcularEdad(a.fecha);
    if (edad < 12) {
      this.mostrarAlerta('El alumno debe tener al menos 12 años');
      return;
    }
if (edad > 100) {
  this.mostrarAlerta('La edad del alumno no puede ser mayor a 100 años');
  return;
}
    }
    if (!a.genero) {
      this.mostrarAlerta('Selecciona el género');
      return;
    }
    if (!a.fk_caralu) {
      this.mostrarAlerta('Selecciona una carrera');
      return;
    }

    this.guardarDatos();
  }

  guardarDatos() {
    const urlAPI = 'http://localhost/api_ionic/Estudiantes.php';

    this.http.post(urlAPI, this.alumnos).subscribe({
      next: (respuesta: any) => {
        console.log('Respuesta del servidor', respuesta);

        if (respuesta.status === 'success') {
          this.mostrarAlerta(respuesta.mensaje || 'Alumno registrado con exito', 'Registro Exitoso');
          this.alumnos = this.alumnoVacio(); // limpia el formulario
        }
      },
      error: (error) => {
        console.error('Error capturado', error);

        if (error.status === 409) {
          this.mostrarAlerta(error.error?.mensaje || 'Registro ya existente', 'Registro no permitido');
          return;
        }
        if (error.status === 0) {
          this.mostrarAlerta('No se pudo comunicar con el servidor', 'Error de red');
          return;
        }
        this.mostrarAlerta(error.error?.mensaje || 'Ocurrió un error inesperado al guardar.', 'Error');
      }
    });
  }
}
