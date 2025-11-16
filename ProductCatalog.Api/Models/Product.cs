using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductCatalog.Api.Models;

public class Product
{
    // EF
    protected Product()
    {
        
    }

    public Product(string name, decimal price)
    {
        ValidateName(name);
        ValidatePrice(price);
        Name = name;
        Price = price;
    }

    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; private set; }
    public string Name { get; private set; }
    public decimal Price { get; private set; }

    public void UpdateName(string name)
    {
        ValidateName(name);
        Name = name;
    }

    public void UpdatePrice(decimal price)
    {
        ValidatePrice(price);
        Price = price;
    }

    private static void ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Product name cannot be null or empty.", nameof(name));
    }

    private static void ValidatePrice(decimal price)
    {
        if (price < 0)
            throw new ArgumentOutOfRangeException(nameof(price), "Price cannot be negative.");
    }
}
