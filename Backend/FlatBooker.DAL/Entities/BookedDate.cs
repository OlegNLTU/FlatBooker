namespace FlatBooker.DAL.Entities
{
    public class BookedDate
    {
        public string Id { get; set; }  
        public DateOnly Start { get; set; }  
        public DateOnly End { get; set; }

        public string FlatId { get; set; }
        public Flat? Flat { get; set; }

        public string UserId { get; set; }
        public User? User { get; set; }
    }
}
