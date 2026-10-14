import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent,IonButton } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario = {
    nombre: '',
    matricula: '',
    correo: ''
  };

  constructor(private router: Router) {}

  guardarDatos() {
    // Validación básica: verificar que los campos no estén vacíos
    if (this.usuario.nombre && this.usuario.matricula && this.usuario.correo) {
      
      console.log('Datos guardados:', this.usuario);
      
      // Aquí puedes guardar en el Storage, base de datos, etc.
      
      // 3. Redirige al usuario a la siguiente página de tu app
      this.router.navigate(['/dashboard']); 
      
    } else {
      alert('Por favor, rellena todos los campos antes de continuar.');
    }
  }
}
