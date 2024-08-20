using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); 

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {

            policy.WithOrigins("http://localhost:65055","http://localhost:62447", "https://localhost:7225", "http://localhost:55597")

                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();


// Configure the HTTP request pipeline.
if (true)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles(new StaticFileOptions()
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), @"uploadedFiles")),
    RequestPath = new PathString("/Images")
});


app.UseCors("AllowAll");

app.UseAuthorization();

app.UseStaticFiles(); // Enable serving static files

app.MapControllers();

app.MapHub<ChatHub>("/chatHub");

app.Run();
