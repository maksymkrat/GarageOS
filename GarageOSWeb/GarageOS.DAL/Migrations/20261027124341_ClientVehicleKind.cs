using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GarageOS.DAL.Migrations
{
    /// <inheritdoc />
    public partial class ClientVehicleKind : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Every car already in the table is a car: the garage had no way to
            // enter anything else, so «Авто» is a fact about the old rows and
            // not a placeholder. EF would otherwise backfill an empty string,
            // which no catalogue matches.
            migrationBuilder.AddColumn<string>(
                name: "kind",
                table: "client_vehicles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Авто");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "kind",
                table: "client_vehicles");
        }
    }
}
