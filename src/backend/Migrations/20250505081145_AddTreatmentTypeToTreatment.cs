using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BDogs.Migrations
{
    /// <inheritdoc />
    public partial class AddTreatmentTypeToTreatment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Treatments",
                columns: table => new
                {
                    TreatmentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Cost = table.Column<double>(type: "float", nullable: false),
                    DogID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Treatments", x => x.TreatmentID);
                    table.ForeignKey(
                        name: "FK_Treatments_Dogs_DogID",
                        column: x => x.DogID,
                        principalTable: "Dogs",
                        principalColumn: "DogID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Treatments_DogID",
                table: "Treatments",
                column: "DogID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Treatments");
        }
    }
}
