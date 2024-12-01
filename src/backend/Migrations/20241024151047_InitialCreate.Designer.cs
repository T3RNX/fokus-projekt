using BDogs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BDogs.Migrations
{
    [DbContext(typeof(DogDbContext))]
    [Migration("20241024151047_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("BDogs.Dog", b =>
            {
                b.Property<int>("HundID")
                    .ValueGeneratedOnAdd()
                    .HasColumnType("int");

                SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("HundID"));

                b.Property<int>("Alter")
                    .HasColumnType("int");

                b.Property<int>("BesitzerID")
                    .HasColumnType("int");

                b.Property<double>("Gewicht")
                    .HasColumnType("float");

                b.Property<string>("Name")
                    .IsRequired()
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("Rasse")
                    .IsRequired()
                    .HasColumnType("nvarchar(max)");

                b.HasKey("HundID");

                b.ToTable("Dogs");
            });
#pragma warning restore 612, 618
        }
    }
}