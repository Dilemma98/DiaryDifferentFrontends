using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerUI;

var builder = WebApplication.CreateBuilder(args);

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            //4200: Angular, 8080: Vue, 
            policy.WithOrigins("http://localhost:4200", "http://localhost:8080/") // Exempel på frontend-URL (kan vara den port du kör din frontend på)
                  .AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// Lägg till loggning
builder.Logging.AddConsole();

// Lägg till tjänster till containern
builder.Services.AddControllers();

// Lägg till Swagger med Swashbuckle
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Dagboks-API", Version = "v1" });
});

var app = builder.Build();

// Use CORS
app.UseCors("AllowSpecificOrigin");

// Konfigurera HTTP-förfrågningspipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

// app.UseHttpsRedirection();

app.MapControllers();

app.Run();

