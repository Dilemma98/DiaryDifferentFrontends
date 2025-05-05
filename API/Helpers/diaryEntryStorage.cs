using System.Text.Json;
using DagbokOlikaFrontendRamverk.API.Models;

namespace DagbokOlikaFrontendRamverk.API.Services
{
    // Static helper class to handle reading from and writing to a JSON file
    public static class DiaryEntryStorage
    {
        // Path to the JSON file where diary entries are stored
        private static readonly string FilePath = "Data/diaryEntries.json";

        // Loads all diary entries from the JSON file
        public static List<DiaryEntry> LoadEntries()
        {
            // If the file doesn't exist, return an empty list
            if (!File.Exists(FilePath))
                return new List<DiaryEntry>();

            // Read the entire file content
            var json = File.ReadAllText(FilePath);

            // Deserialize the JSON into a list of DiaryEntry objects
            return JsonSerializer.Deserialize<List<DiaryEntry>>(json) ?? new List<DiaryEntry>();
        }

        // Saves the given list of diary entries to the JSON file
        public static void SaveEntries(List<DiaryEntry> entries)
        {
            // Serialize the list into JSON with indentation for readability
            var json = JsonSerializer.Serialize(entries, new JsonSerializerOptions { WriteIndented = true });

            // Write the JSON content to the file, overwriting any existing data
            File.WriteAllText(FilePath, json);
        }
    }
}