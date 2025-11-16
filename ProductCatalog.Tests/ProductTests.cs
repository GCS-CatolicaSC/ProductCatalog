using ProductCatalog.Api.Models;

namespace ProductCatalog.Tests;

public class ProductTests
{
    [Fact]
    public void Should_Create_Product_Successfully()
    {
        // Arrange
        var name = "Test Product";
        var price = 99.99m;

        // Act
        var product = new Product(name, price);

        // Assert
        Assert.Equal(name, product.Name);
        Assert.Equal(price, product.Price);
    }

    [Fact]
    public void Should_Throw_Exception_For_Invalid_Name()
    {
        // Arrange
        var invalidName = "";
        var price = 50.00m;

        // Act & Assert
        Assert.Throws<ArgumentException>(() => new Product(invalidName, price));
    }

    [Fact]
    public void Should_Throw_Exception_For_Negative_Price()
    {
        // Arrange
        var name = "Valid Name";
        var negativePrice = -10.00m;

        // Act & Assert
        Assert.Throws<ArgumentOutOfRangeException>(() => new Product(name, negativePrice));
    }
}
