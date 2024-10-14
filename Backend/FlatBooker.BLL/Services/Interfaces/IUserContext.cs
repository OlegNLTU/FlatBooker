namespace FlatBooker.BLL.Services.Interfaces
{
    public interface IUserContext
    {
        string? GetUserId();
        string? GetUserRole();
    }
}
