using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GarageOS.DAL.Migrations
{
    /// <summary>
    /// Drops <c>cars.debt</c>; the debt is derived from orders now (ADR-0011).
    /// <c>Down</c> brings the column back empty — the values are not restorable.
    /// </summary>
    public partial class DropCarDebt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "debt",
                table: "cars");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "debt",
                table: "cars",
                type: "numeric(10,2)",
                precision: 10,
                scale: 2,
                nullable: false,
                defaultValue: 0m);
        }
    }
}
