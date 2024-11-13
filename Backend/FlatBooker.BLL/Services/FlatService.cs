using FlatBooker.BLL.Models;
using FlatBooker.BLL.Services.Interfaces;
using FlatBooker.DAL.DbContext;
using FlatBooker.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace FlatBooker.BLL.Services
{
    public class FlatService : IFlatService
    {
        private readonly FlatBookerDbContext _context;
        public FlatService(FlatBookerDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddFlatAsync(FlatModel flatModel, string userId)
        {
            var flat = new Flat
            {
                Id = Guid.NewGuid().ToString(),
                Address = flatModel.Address,
                CountOfRooms = flatModel.CountOfRooms,
                CountOfBuildingFloors = flatModel.CountOfBuildingFloors,
                Price = flatModel.Price,
                Square = flatModel.Square,
                Floor = flatModel.Floor,
                IndividualHeating = flatModel.IndividualHeating,
                Parking = flatModel.Parking,
                PetFriendly = flatModel.PetFriendly,
                OwnerId = userId
            };

            foreach (var imageBase64 in flatModel.ImageBase64)
            {
                var image = new Image
                {
                    Id = Guid.NewGuid().ToString(),
                    FlatId = flat.Id,
                    ImageBase64 = imageBase64
                };

                _context.FlatImages.Add(image);
            }

            _context.Flats.Add(flat);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Flat?> GetFlatByIdAsync(string flatId)
        {
            return await _context.Flats
                .FirstOrDefaultAsync(f => f.Id == flatId);
        }

        public async Task<bool> DeleteFlatAsync(string flatId)
        {
            var flat = await _context.Flats.FindAsync(flatId);
            if (flat == null)
                return false;

            _context.Flats.Remove(flat);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateFlatAsync(string flatId, FlatModel flatModel)
        {
            var flat = await _context.Flats.FindAsync(flatId);
            if (flat == null)
                return false;

            flat.Address = flatModel.Address;
            flat.CountOfRooms = flatModel.CountOfRooms;
            flat.CountOfBuildingFloors = flatModel.CountOfBuildingFloors;
            flat.Price = flatModel.Price;
            flat.Square = flatModel.Square;
            flat.Floor = flatModel.Floor;
            flat.IndividualHeating = flatModel.IndividualHeating;
            flat.Parking = flatModel.Parking;
            flat.PetFriendly = flatModel.PetFriendly;


            var existingImages = await _context.FlatImages
                    .Where(f => f.FlatId == flatId)
                    .ToListAsync();

            _context.FlatImages.RemoveRange(existingImages);

            foreach (var imageBase64 in flatModel.ImageBase64)
            {
                var image = new Image
                {
                    Id = Guid.NewGuid().ToString(),
                    FlatId = flatId,
                    ImageBase64 = imageBase64
                };

                _context.FlatImages.Add(image);
            }

            _context.Flats.Update(flat);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> BookFlatAsync(string flatId, string userId, BookingModel bookingModel)
        {
            var flat = await _context.Flats.FindAsync(flatId);

            if (flat == null)
                return false;
            

            var isBooked = _context.BookedDates.Any(bd => bd.FlatId == flatId
                                                          && bd.Start <= bookingModel.End
                                                          && bd.End >= bookingModel.Start);
            if (isBooked)
                return false; 
            

            var bookedDate = new BookedDate
            {
                Id = Guid.NewGuid().ToString(),
                FlatId = flatId,
                UserId = userId,
                Start = bookingModel.Start,
                End = bookingModel.End
            };

            _context.BookedDates.Add(bookedDate);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
