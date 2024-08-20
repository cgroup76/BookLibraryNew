using Microsoft.AspNetCore.SignalR;
//class for conaction to send and get live message 
public class ChatHub : Hub
{
    private readonly ILogger<ChatHub> _logger;

    public ChatHub(ILogger<ChatHub> logger)
    {
        _logger = logger;
    }

    public async Task SendMessage(string user, string message)
    {
        try
        {
            _logger.LogInformation("SendMessage called with user: {User}, message: {Message}", user, message);

            if (string.IsNullOrEmpty(user) || string.IsNullOrEmpty(message))
            {
                throw new ArgumentException("User or message cannot be null or empty");
            }

            // Broadcast the message to all clients
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while sending the message.");
            throw;
        }
    }
}