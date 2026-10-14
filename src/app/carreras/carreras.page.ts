import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonInput,IonSelect,IonSelectOption,IonButton,IonList } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
 
@Component({
  selector: 'app-carreras',
  templateUrl: './carreras.page.html',
  styleUrls: ['./carreras.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonItem,IonInput,IonSelect,IonSelectOption,IonButton,IonList]
})
export class CarrerasPage implements OnInit {
  carrera = {
    nombre: "",
    tipo: ""
  };
 
  // Los valores deben coincidir con el ENUM de la tabla carreras
  tipos = [
    { valor: 'licenciatura', etiqueta: 'Licenciatura' },
    { valor: 'ingenieria', etiqueta: 'Ingeniería' },
    { valor: 'maestria', etiqueta: 'Maestría' }
  ];
 
  constructor(private http: HttpClient, private alertController: AlertController) { }
 
  ngOnInit() {
  }
 
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
 
  guardarDatos() {
    if (!this.carrera.nombre.trim() || !this.carrera.tipo) {
      this.mostrarAlerta('Atención', 'Por favor llena todos los campos.');
      return;
    }
 
    const urlAPI = 'http://localhost/api_ionic/carreras.php';
 
    this.http.post(urlAPI, this.carrera).subscribe({
      next: (respuesta: any) => {
        console.log('Respuesta del servidor', respuesta);
 
        if (respuesta.status === 'success') {
          this.mostrarAlerta('Registro Exitoso', respuesta.mensaje || 'Carrera registrada con éxito');
          this.carrera = { nombre: "", tipo: "" }; // limpia el formulario
        }
      },
      error: (error) => {
        console.error('Error capturado', error);
 
        if (error.status === 409) {
          this.mostrarAlerta('Registro no permitido', error.error?.mensaje || 'Registro ya existente');
          return;
        }
        if (error.status === 0) {
          this.mostrarAlerta('Error de red', 'No se pudo comunicar con el servidor');
          return;
        }
        this.mostrarAlerta('Error', error.error?.mensaje || 'Ocurrió un error inesperado al guardar.');
      }
    });
  }
}
