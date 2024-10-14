namespace FlatBooker.DAL.Entities
{
    public class Flat
    {
        public string Id { get; set; } = null!;
        public string Address { get; set; } = null!;
        public int CountOfRooms { get; set; }
        public int CountOfBuildingFloors { get; set; }

        //PRICE PER MONTH in usd
        public decimal Price { get; set; }

        public double Square { get; set; }
        public int Floor { get; set; }

        public bool IndividualHeating { get; set; }
        public bool Parking { get; set; }
        public bool PetFriendly { get; set; }

        public string OwnerId { get; set; }
        public User Owner { get; set; }
    }
}
