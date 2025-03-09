using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BDogs.Migrations
{
    /// <inheritdoc />
    public partial class AddImagePathToDog2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "Dogs");

            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "Dogs",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "Dogs");

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "Dogs",
                type: "varbinary(max)",
                nullable: true);
        }
    }
}
