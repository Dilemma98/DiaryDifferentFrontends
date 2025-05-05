const apiUrl = 'http://localhost:5187/api/diaryEntries';

export default {
  async getEntries() {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Failed to fetch entries');
    return await response.json();
  },

  async createEntry(entry) {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!response.ok) throw new Error('Failed to create entry');
    return await response.json();
  },

  async updateEntry(entry) {
    const response = await fetch(`${apiUrl}/${entry.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!response.ok) throw new Error('Failed to update entry');
    return await response.json();
  },

  async deleteEntry(id) {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete entry');
    return true;
  }
};
