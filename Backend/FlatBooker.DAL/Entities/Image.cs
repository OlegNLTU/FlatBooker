using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FlatBooker.DAL.Entities
{
    public class Image
    {
        public string Id { get; set; } = null!;
        public string FlatId { get; set; }
        public Flat Flat { get; set; }

        public string? ImageBase64 { get; set; }
    }
}
