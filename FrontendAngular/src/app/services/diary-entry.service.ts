import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface representing the structure of a diary entry
export interface DiaryEntry {
  id: number,
  title: string,
  content: string,
  dateCreated: string
}

@Injectable({
   // This makes the service available application-wide without needing to register it in a module
  providedIn: 'root'
})
export class DiaryEntryService {
  // Base URL for the diary entry API
  private apiUrl = 'http://localhost:5187/api/diaryEntries'; 

  // Injecting Angular's HttpClient for making HTTP requests
  constructor(private http: HttpClient) {}

  // Fetch all diary entries from the server
  getEntries(): Observable<DiaryEntry[]> {
    return this.http.get<DiaryEntry[]>(this.apiUrl);
  }

  // Create a new diary entry
  // `Partial<DiaryEntry>` allows us to omit some properties like id or dateCreated, which the backend may generate
  createEntry(entry: Partial<DiaryEntry>): Observable<DiaryEntry> {
    return this.http.post<DiaryEntry>(this.apiUrl, entry);
  }

  // Update an existing diary entry
  updateEntry(entry: DiaryEntry): Observable<DiaryEntry> {
    return this.http.put<DiaryEntry>(`${this.apiUrl}/${entry.id}`, entry);
  }

  // Delete a diary entry by its ID
  deleteEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
