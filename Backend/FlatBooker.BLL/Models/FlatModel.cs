namespace FlatBooker.BLL.Models
{
    public class FlatModel
    {
        public string Address { get; set; }
        public int CountOfRooms { get; set; }
        public int CountOfBuildingFloors { get; set; }

        public decimal Price { get; set; }
        public double Square { get; set; }
        public int Floor { get; set; }

        public bool IndividualHeating { get; set; }
        public bool Parking { get; set; }
        public bool PetFriendly { get; set; }

        public List<string> ImageBase64 { get; set; } = [];
    }
}
