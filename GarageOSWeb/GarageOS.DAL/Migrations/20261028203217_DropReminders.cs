using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace GarageOS.DAL.Migrations
{
    /// <inheritdoc />
    public partial class DropReminders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "reminders");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "reminders",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    client_vehicle_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    due_date = table.Column<DateOnly>(type: "date", nullable: true),
                    due_mileage = table.Column<int>(type: "integer", nullable: true),
                    message = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_reminders", x => x.id);
                    table.ForeignKey(
                        name: "fk_reminders_client_vehicles_client_vehicle_id",
                        column: x => x.client_vehicle_id,
                        principalTable: "client_vehicles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_reminders_client_vehicle_id",
                table: "reminders",
                column: "client_vehicle_id");
        }
    }
}
