namespace DagbokOlikaFrontendRamverk.API.Models
{
    public class DiaryEntry
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime DateCreated { get; set; }

    }
}
