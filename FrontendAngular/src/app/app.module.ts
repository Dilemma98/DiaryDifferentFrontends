import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // Lägg till denna rad
import { DiaryEntriesPartComponent } from './diary-entries-part/diary-entries-part.component';  // Se till att denna import är korrekt
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, DiaryEntriesPartComponent, RouterModule],  // Importerar både DiaryEntriesPart och RouterModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
