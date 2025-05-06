import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiaryEntryService, DiaryEntry } from '../services/diary-entry.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-diary-entries-part',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './diary-entries-part.component.html',
  styleUrls: ['./diary-entries-part.component.css'],
})
export class DiaryEntriesPartComponent implements OnInit {
  // --- ZONE-BASED (old way) ---
  // entries: DiaryEntry[] = []; // <-- Commented out, replaced with signal below

  // --- SIGNAL-BASED (new way) ---
  // This is now a reactive signal. Use entries() to read, and entries.set(...) to update.
  entries = signal<DiaryEntry[]>([]);

  // Model for the form
  newEntry: DiaryEntry = { id: 0, title: '', content: '', dateCreated: '' };
  // Keeps track of the entry being edited (if any)
  editingEntry: DiaryEntry | null = null;

  constructor(private diaryService: DiaryEntryService) {}

  ngOnInit(): void {
    this.loadEntries();
  }

  loadEntries(): void {
    this.diaryService.getEntries().subscribe({
      next: (data: DiaryEntry[]) => {
        console.log('Fetched Entries:', data);
        // Sort entries and update signal
        const sortedEntries = data.sort((a, b) => {
          const dateA = a.dateCreated ? new Date(a.dateCreated).getTime() : 0;
          const dateB = b.dateCreated ? new Date(b.dateCreated).getTime() : 0;
          return dateB - dateA;
        });
        this.entries.set(sortedEntries);
      },
      error: (err: any) => {
        console.error('Error fetching entries:', err);
      },
    });
  }

  createEntry(): void {
    if (this.editingEntry) {
      const updatedEntry = {
        ...this.editingEntry,
        title: this.newEntry.title,
        content: this.newEntry.content,
      };

      this.diaryService.updateEntry(updatedEntry).subscribe({
        next: () => {
          this.loadEntries();  // Reload entries after update
          this.editingEntry = null;
          this.newEntry = { id: 0, title: '', content: '', dateCreated: '' };
        },
        error: (err) => console.error('Update failed:', err),
      });
    } else {
      const entry = {
        title: this.newEntry.title,
        content: this.newEntry.content,
        dateCreated: new Date().toISOString(),
      };

      this.diaryService.createEntry(entry).subscribe({
        next: (createdEntry) => {
          // Immediately add the new entry to the list without reloading from the server
          this.entries.set([createdEntry, ...this.entries()]);
          this.newEntry = { id: 0, title: '', content: '', dateCreated: '' };  // Clear form
        },
        error: (err) => console.error('Creation failed:', err),
      });
    }
  }

  editEntry(entry: DiaryEntry): void {
    this.newEntry = {
      id: entry.id,
      title: entry.title,
      content: entry.content,
      dateCreated: entry.dateCreated,
    };
    this.editingEntry = entry;
  }

  deleteEntry(entry: DiaryEntry): void {
    if (confirm('Vill du verkligen ta bort det här inlägget?')) {
      this.diaryService.deleteEntry(entry.id).subscribe({
        next: () => this.loadEntries(),  // Reload entries after deletion
        error: (err) => console.error('Delete failed:', err),
      });
    }
  }
}
