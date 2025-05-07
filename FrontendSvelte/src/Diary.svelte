<script>
	import { onMount } from 'svelte';

	let entries = [];
	let newEntry = { title: '', content: '' };
	let editingEntry = null;

	// Fetch diary entries from API
	function fetchEntries() {
		fetch('http://localhost:5187/api/diaryentries')
			.then(res => res.json())
			.then(data => {
				// Sort entries by creation date (most recent first)
				entries = data.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
			})
			.catch(err => console.error('Fetch error:', err));
	}

	// Save new entry or update an existing one
	function saveEntry() {
		const method = editingEntry ? 'PUT' : 'POST';
		const url = editingEntry
			? `http://localhost:5187/api/diaryentries/${editingEntry.id}` // Update existing entry
			: 'http://localhost:5187/api/diaryentries'; // Create new entry

		fetch(url, {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newEntry)
		})
			.then(res => res.json())
			.then(data => {
				if (editingEntry) {
					// Update the entry in the entries list
					entries = entries.map(entry => entry.id === data.id ? data : entry);
				} else {
					// Add the new entry at the start of the entries list
					entries = [data, ...entries];
				}
				// Reset form after saving
				newEntry = { title: '', content: '' };
				editingEntry = null; // Reset editing state
			})
			.catch(err => console.error('Save error:', err));
	}

	// Delete an entry
	function deleteEntry(id) {
		fetch(`http://localhost:5187/api/diaryentries/${id}`, {
			method: 'DELETE'
		})
			.then(() => {
				// Remove the deleted entry from the list
				entries = entries.filter(entry => entry.id !== id);
			})
			.catch(err => console.error('Delete error:', err));
	}

	// Set up form for editing an entry
	function editEntry(entry) {
		newEntry = { title: entry.title, content: entry.content };
		editingEntry = entry;
	}

	// Fetch entries on component mount
	onMount(fetchEntries);
</script>

<!-- FORM SECTION -->
<div class="form-container">
	<h2>{editingEntry ? 'Edit Entry ✨' : 'Write New Entry ✨'}</h2>
	<form on:submit|preventDefault={saveEntry}>
		<input bind:value={newEntry.title} placeholder="Title" required />
		<textarea bind:value={newEntry.content} placeholder="What do you want to write today?" rows="5" required></textarea>
		<button type="submit">💌 {editingEntry ? 'Update' : 'Publish'}</button>
	</form>
</div>

<!-- ENTRIES DISPLAY SECTION -->
<div class="entries-container">
	{#if entries.length > 0}
		{#each entries as entry (entry.id)}
			<div class="entry">
				<hr />
				<h3>{entry.title}</h3>
				<p>{entry.content}</p>
				<small class="date">
					📆 {new Date(entry.dateCreated).toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}<br />
					⌚️ {new Date(entry.dateCreated).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
				</small>
				<div class="entry-actions">
					<button on:click={() => editEntry(entry)}>✏️</button>
					<button on:click={() => deleteEntry(entry.id)}>🗑️</button>
				</div>
			</div>
		{/each}
	{:else}
		<p class="no-entries">No entries yet. Write something cute!</p>
	{/if}
</div>

<!-- STYLES – keep your original styles -->
<style>
	@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');

	.form-container {
		font-family: 'Quicksand', sans-serif;
		position: fixed;
		top: 20vh;
		right: 1rem;
		background-color: #fff8fc;
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 4px 10px rgba(255, 192, 203, 0.2);
		border: 2px dashed #ffb6c1;
		width: 20%;
	}

	.form-container h2 {
		color: #e75480;
		text-align: center;
	}

	.form-container input,
	.form-container textarea {
		width: 90%;
		padding: 0.8rem;
		margin-bottom: 1rem;
		border: 2px solid #ffd6e8;
		border-radius: 8px;
		font-size: 1rem;
		background-color: #fff;
		font-family: inherit;
		text-align: center;
	}

	.form-container button {
		width: 100%;
		background-color: #ff69b4;
		color: white;
		border: none;
		padding: 0.8rem;
		border-radius: 8px;
		font-size: 1rem;
		cursor: pointer;
	}

	.entries-container {
		font-family: 'Quicksand', sans-serif;
		padding: 2rem;
	}

	.entries-container .entry {
		width: 60%;
		margin: 0 auto 1.5rem auto;
		background-color: #ffeef8;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 6px rgba(255, 192, 203, 0.2);
		text-align: center;
	}

	.entries-container .entry h3 {
		color: #d14c84;
	}

	.entry-actions {
		margin-top: 1rem;
		display: flex;
		justify-content: center;
		gap: 1rem;
	}

	.entry-actions button {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.2rem;
	}
</style>
