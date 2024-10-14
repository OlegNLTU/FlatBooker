﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FlatBooker.BLL.Services.Interfaces
{
    public interface IJwtService
    {
        string GetToken(string id, string username, string role);
    }
}