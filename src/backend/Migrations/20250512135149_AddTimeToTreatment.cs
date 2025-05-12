using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BDogs.Migrations
{
    /// <inheritdoc />
    public partial class AddTimeToTreatment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateOnly>(
                name: "Date",
                table: "Treatments",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<TimeOnly>(
                name: "Time",
                table: "Treatments",
                type: "time",
                nullable: false,
                defaultValue: new TimeOnly(0, 0, 0));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Time",
                table: "Treatments");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Date",
                table: "Treatments",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "date");
        }
    }
}
