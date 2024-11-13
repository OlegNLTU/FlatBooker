using FlatBooker.BLL.Models;
using FlatBooker.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FlatBooker.BLL.Services.Interfaces
{
    public interface IFlatService
    {
        Task<bool> AddFlatAsync(FlatModel flatModel, string userId);
        Task<Flat?> GetFlatByIdAsync(string flatId);
        Task<bool> DeleteFlatAsync(string flatId);
        Task<bool> UpdateFlatAsync(string flatId, FlatModel flatModel);
        Task<bool> BookFlatAsync(string flatId, string userId, BookingModel bookingModel);
    }
}
