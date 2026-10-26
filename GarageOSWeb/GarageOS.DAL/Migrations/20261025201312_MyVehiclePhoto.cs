using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GarageOS.DAL.Migrations
{
    /// <inheritdoc />
    public partial class MyVehiclePhoto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "photo_id",
                table: "my_vehicles",
                type: "uuid",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "photo_id",
                table: "my_vehicles");
        }
    }
}
