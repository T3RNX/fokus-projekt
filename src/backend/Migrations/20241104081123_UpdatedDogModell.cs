using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BDogs.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedDogModell : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Rasse",
                table: "Dogs",
                newName: "Race");

            migrationBuilder.RenameColumn(
                name: "Gewicht",
                table: "Dogs",
                newName: "Weight");

            migrationBuilder.RenameColumn(
                name: "BesitzerID",
                table: "Dogs",
                newName: "OwnerID");

            migrationBuilder.RenameColumn(
                name: "Alter",
                table: "Dogs",
                newName: "Age");

            migrationBuilder.RenameColumn(
                name: "HundID",
                table: "Dogs",
                newName: "DogID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Weight",
                table: "Dogs",
                newName: "Gewicht");

            migrationBuilder.RenameColumn(
                name: "Race",
                table: "Dogs",
                newName: "Rasse");

            migrationBuilder.RenameColumn(
                name: "OwnerID",
                table: "Dogs",
                newName: "BesitzerID");

            migrationBuilder.RenameColumn(
                name: "Age",
                table: "Dogs",
                newName: "Alter");

            migrationBuilder.RenameColumn(
                name: "DogID",
                table: "Dogs",
                newName: "HundID");
        }
    }
}
