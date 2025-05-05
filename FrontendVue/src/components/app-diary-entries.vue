<template>
    <div>
        <!-- Form for creating or editing a diary entry -->
        <form @submit.prevent="createOrUpdateEntry">
            <input v-model="newEntry.title" placeholder="Titel" required />
            <textarea v-model="newEntry.content" placeholder="Vad vill du skriva idag?" rows="5" required></textarea>
            <button type="submit">{{ editingEntry ? 'Uppdatera' : 'Skapa' }}</button>
        </form>
        <!-- List of diary entries -->
        <div v-if="entries.length > 0">
            <div v-for="entry in entries" :key="entry.id" class="entry">
                <h3>{{ entry.title }}</h3>
                <p>{{ entry.content }}</p>
                <small>{{ formatDate(entry.dateCreated) }}</small>
                <button @click="editEntry(entry)">✏️ Redigera</button>
                <button @click="deleteEntry(entry)">🗑️ Ta bort</button>
            </div>
        </div>
        <p v-else class="no-entries">Inga inlägg än. Skriv något gulligt!</p>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import DiaryEntryService from './service/diary-entry.service';

export default {
    name: 'DiaryEntriesPart',
    setup() {
        const entries = ref([]);
        const newEntry = ref({ id: 0, title: '', content: '', dateCreated: '' });
        const editingEntry = ref(null);

        const loadEntries = async () => {
            try {
                const data = await DiaryEntryService.getEntries();
                console.log('Fetched Entries:', data);
                entries.value = data.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
            } catch (err) {
                console.error('Error fetching entries:', err);
            }
        };

        const createOrUpdateEntry = async () => {
            if (editingEntry.value) {
                try {
                    const updatedEntry = {
                        ...editingEntry.value,
                        title: newEntry.value.title,
                        content: newEntry.value.content,
                    };
                    await DiaryEntryService.updateEntry(updatedEntry);
                    await loadEntries();
                    editingEntry.value = null;
                    newEntry.value = { id: 0, title: '', content: '', dateCreated: '' };
                } catch (err) {
                    console.error('Update failed:', err);
                }
            } else {
                try {
                    const entry = {
                        title: newEntry.value.title,
                        content: newEntry.value.content,
                        dateCreated: new Date().toISOString(),
                    };
                    const createdEntry = await DiaryEntryService.createEntry(entry);
                    entries.value.unshift(createdEntry);
                    newEntry.value = { id: 0, title: '', content: '', dateCreated: '' };
                } catch (err) {
                    console.error('Creation failed:', err);
                }
            }
        };

        const editEntry = (entry) => {
            newEntry.value = { ...entry };
            editingEntry.value = entry;
        };

        const deleteEntry = async (entry) => {
            if (confirm('Vill du verkligen ta bort det här inlägget?')) {
                try {
                    await DiaryEntryService.deleteEntry(entry.id);
                    entries.value = entries.value.filter((e) => e.id !== entry.id);
                } catch (err) {
                    console.error('Delete failed:', err);
                }
            }
        };

        const formatDate = (date) => {
            return new Date(date).toLocaleString();
        };

        onMounted(() => {
            loadEntries();
        });

        return {
            entries,
            newEntry,
            editingEntry,
            loadEntries,
            createOrUpdateEntry,
            editEntry,
            deleteEntry,
            formatDate,
        };
    },
};
</script>

<style scoped>
.no-entries {
    text-align: center;
    color: #aaa;
    font-style: italic;
    font-size: 1.2rem;
    margin-top: 2rem;
}

.entry {
    background: #fff3f8;
    border: 1px solid #ffb6c1;
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 6px rgba(255, 182, 193, 0.3);
}

.entry h3 {
    margin: 0 0 0.5rem;
    font-size: 1.3rem;
    color: #c2185b;
}

.entry p {
    margin: 0 0 0.5rem;
    line-height: 1.5;
    white-space: pre-wrap;
}

.entry small {
    display: block;
    color: #666;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
}

button {
    background-color: #f8bbd0;
    color: #4a148c;
    border: none;
    border-radius: 6px;
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

button:hover {
    background-color: #f48fb1;
}

form {
    background: #fce4ec;
    padding: 1.5rem;
    border-radius: 12px;
    margin-top: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

input,
textarea {
    width: 100%;
    padding: 0.7rem;
    margin-bottom: 1rem;
    border: 1px solid #ffccd5;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    box-sizing: border-box;
}

input:focus,
textarea:focus {
    outline: none;
    border-color: #f48fb1;
    box-shadow: 0 0 0 2px rgba(244, 143, 177, 0.2);
}

form button {
    background-color: #f06292;
    color: #fff;
    font-weight: bold;
}

form button:hover {
    background-color: #ec407a;
}
</style>