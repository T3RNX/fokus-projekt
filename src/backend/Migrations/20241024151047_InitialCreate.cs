using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BDogs.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Dogs",
                columns: table => new
                {
                    HundID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Alter = table.Column<int>(type: "int", nullable: false),
                    Rasse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Gewicht = table.Column<double>(type: "float", nullable: false),
                    BesitzerID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dogs", x => x.HundID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Dogs");
        }
    }
}
