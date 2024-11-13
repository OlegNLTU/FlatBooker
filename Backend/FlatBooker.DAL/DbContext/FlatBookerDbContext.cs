using FlatBooker.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace FlatBooker.DAL.DbContext
{
    public class FlatBookerDbContext : IdentityDbContext
    {
        public FlatBookerDbContext(){}
        public FlatBookerDbContext(DbContextOptions<FlatBookerDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Flat> Flats { get; set; } = null!;
        public DbSet<BookedDate> BookedDates { get; set; } = null!;
        public DbSet<Image> FlatImages { get; set; } = null!;

    }
}
