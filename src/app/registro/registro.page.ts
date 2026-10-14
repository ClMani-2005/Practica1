import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonInput,IonList,IonButton,IonButtons } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonItem,
    IonInput,IonList,IonButton]
})
export class RegistroPage implements OnInit {
  usuario={
    nombre:"",
    matricula:"",
    correo:""
  };

  constructor(private http: HttpClient, private router: Router,private alertController: AlertController) { }


  ngOnInit() {}

  async mostrarAlerta(titulo: string, mensaje: string, alCerrar?: () => void) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            if (alCerrar) {
              alCerrar();
            }
          }
        }
      ]
    });
    await alert.present();
  }


  guardarDatos(){
    // Validación básica en el frontend antes de disparar la petición
    if (!this.usuario.nombre.trim() || !this.usuario.matricula.trim() || !this.usuario.correo.trim()) {
      this.mostrarAlerta('Atención', 'Por favor llena todos los campos.');
      return;
    }

    console.log('Datos listos para enviar');
    const urlAPI= 'http://localhost/api_ionic/Registro.php';

    this.http.post(urlAPI,this.usuario).subscribe({
      next:(respuesta: any)=>{
        console.log('Respuesta del servidor', respuesta);
        
        if(respuesta.status === 'success'){
          this.mostrarAlerta('Registro Exitoso', respuesta.mensaje || 'Alumno registrado con exito',() =>
          {this.router.navigate(['/home']);} );
        }
      },
      error:(error) => {
        console.error('Error capturado', error);
        
        if(error.status===409){
          const advertencia = error.error?.mensaje || 'Registro ya existente';
          this.mostrarAlerta('Registro no permitido',advertencia);
          return;
        }
        if(error.status === 0){
          this.mostrarAlerta('Error de red','No se pudo comunicar con el servidor ');
          return;
        }
        // Otros errores (500, 404, etc.)
        const mensaje = error.error?.mensaje || 'Ocurrió un error inesperado al guardar.';
        this.mostrarAlerta('Error', mensaje);


      }
    });



  }
}
